/**
 * NEVERENDEVER PORTAL - AUTHENTICATION MANAGER
 * Unified authentication system with Supabase integration
 * Works across all pages
 */

class AuthManager {
  constructor() {
    this.supabaseClient = null;
    this.currentUser = null;
    this.authStateListeners = [];
    
    this.init();
  }

  // ============================================
  // INITIALIZATION
  // ============================================
  async init() {
    // Wait for Supabase client to be available
    if (typeof supabase !== 'undefined') {
      this.supabaseClient = supabase;
      await this.checkSession();
    } else {
      console.warn('[AuthManager] Supabase client not found. Using fallback auth.');
    }
    
    this.setupAuthUI();
    console.log('[AuthManager] Initialized');
  }

  async checkSession() {
    try {
      const { data: { user }, error } = await this.supabaseClient.auth.getUser();
      
      if (error) throw error;
      
      if (user) {
        this.currentUser = user;
        AppState.setUser({
          id: user.id,
          email: user.email,
          name: user.user_metadata?.username || user.email.split('@')[0],
          avatar: user.user_metadata?.avatar_url || null,
          role: user.user_metadata?.role || 'user'
        });
        this.notifyAuthStateChange('signedIn', user);
      }
    } catch (error) {
      console.error('[AuthManager] Session check failed:', error);
    }
  }

  // ============================================
  // AUTHENTICATION METHODS
  // ============================================
  async signUp(email, password, username = null) {
    try {
      if (!Utils.validate.email(email)) {
        throw new Error('Invalid email address');
      }
      
      if (!Utils.validate.password(password)) {
        throw new Error('Password must be at least 8 characters');
      }

      const { data, error } = await this.supabaseClient.auth.signUp({
        email,
        password,
        options: {
          data: {
            username: username || email.split('@')[0]
          }
        }
      });

      if (error) throw error;

      Utils.toast.success('Sign up successful! Please check your email to verify your account.');
      return { success: true, data };
    } catch (error) {
      console.error('[AuthManager] Sign up error:', error);
      Utils.toast.error(error.message || 'Sign up failed');
      return { success: false, error: error.message };
    }
  }

  async signIn(email, password) {
    try {
      if (!Utils.validate.email(email)) {
        throw new Error('Invalid email address');
      }

      const { data, error } = await this.supabaseClient.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;

      this.currentUser = data.user;
      AppState.setUser({
        id: data.user.id,
        email: data.user.email,
        name: data.user.user_metadata?.username || data.user.email.split('@')[0],
        avatar: data.user.user_metadata?.avatar_url || null,
        role: data.user.user_metadata?.role || 'user'
      });

      this.notifyAuthStateChange('signedIn', data.user);
      Utils.toast.success('Welcome back!');
      
      return { success: true, data };
    } catch (error) {
      console.error('[AuthManager] Sign in error:', error);
      Utils.toast.error(error.message || 'Sign in failed');
      return { success: false, error: error.message };
    }
  }

  async signOut() {
    try {
      const { error } = await this.supabaseClient.auth.signOut();
      
      if (error) throw error;

      this.currentUser = null;
      AppState.logout();
      this.notifyAuthStateChange('signedOut');
      Utils.toast.info('Signed out successfully');
      
      // Redirect to home if needed
      if (window.location.pathname.includes('/dashboard') || 
          window.location.pathname.includes('/profile')) {
        window.location.href = '/';
      }

      return { success: true };
    } catch (error) {
      console.error('[AuthManager] Sign out error:', error);
      Utils.toast.error('Sign out failed');
      return { success: false, error: error.message };
    }
  }

  async resetPassword(email) {
    try {
      const { error } = await this.supabaseClient.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + '/pages/auth/reset-password'
      });

      if (error) throw error;

      Utils.toast.success('Password reset email sent!');
      return { success: true };
    } catch (error) {
      console.error('[AuthManager] Password reset error:', error);
      Utils.toast.error(error.message);
      return { success: false, error: error.message };
    }
  }

  async updateProfile(updates) {
    try {
      const { data, error } = await this.supabaseClient.auth.updateUser({
        data: updates
      });

      if (error) throw error;

      // Update local state
      const currentState = AppState.getUser();
      AppState.setUser({ ...currentState, ...updates });

      Utils.toast.success('Profile updated!');
      return { success: true, data };
    } catch (error) {
      console.error('[AuthManager] Profile update error:', error);
      Utils.toast.error('Profile update failed');
      return { success: false, error: error.message };
    }
  }

  // ============================================
  // FALLBACK AUTH (No Supabase)
  // ============================================
  async fallbackSignUp(email, password, username) {
    const users = Utils.storage.get('endever_users_db', {});
    
    if (users[email]) {
      Utils.toast.error('User already exists');
      return { success: false, error: 'User already exists' };
    }

    users[email] = {
      email,
      password, // In production, this should be hashed
      username: username || email.split('@')[0],
      createdAt: new Date().toISOString(),
      role: 'user'
    };

    Utils.storage.set('endever_users_db', users);
    Utils.toast.success('Account created! You can now sign in.');
    return { success: true };
  }

  async fallbackSignIn(email, password) {
    const users = Utils.storage.get('endever_users_db', {});
    const user = users[email];

    if (!user || user.password !== password) {
      Utils.toast.error('Invalid credentials');
      return { success: false, error: 'Invalid credentials' };
    }

    AppState.setUser({
      email: user.email,
      name: user.username,
      role: user.role || 'user'
    });

    this.notifyAuthStateChange('signedIn', user);
    Utils.toast.success('Welcome back!');
    return { success: true };
  }

  // ============================================
  // UI MANAGEMENT
  // ============================================
  setupAuthUI() {
    // Listen for auth state changes
    AppState.on('userChanged', (user) => {
      this.renderAuthUI(user);
    });

    AppState.on('userLogout', () => {
      this.renderAuthUI(null);
    });

    // Initial render
    this.renderAuthUI(AppState.getUser());
  }

  renderAuthUI(user) {
    const authContainers = document.querySelectorAll('.auth-ui-container, #nav-auth-container');
    
    authContainers.forEach(container => {
      if (user) {
        // User is logged in
        container.innerHTML = `
          <div class="flex items-center gap-md">
            <button class="btn-icon" onclick="AuthManager.openNotifications()" title="Notifications">
              <i class="fas fa-bell"></i>
            </button>
            <div class="user-menu cursor-pointer" onclick="AuthManager.toggleUserMenu(event)">
              <div class="flex items-center gap-sm">
                ${user.avatar ? 
                  `<img src="${user.avatar}" alt="${user.name}" class="w-8 h-8 rounded-full" />` :
                  `<div class="w-8 h-8 rounded-full bg-primary-purple flex items-center justify-center text-sm font-bold">
                    ${user.name.charAt(0).toUpperCase()}
                  </div>`
                }
                <span class="text-sm font-semibold">${user.name}</span>
                <i class="fas fa-chevron-down text-xs text-secondary"></i>
              </div>
            </div>
          </div>
        `;
      } else {
        // User is not logged in
        container.innerHTML = `
          <button class="btn btn-primary" onclick="AuthManager.openAuthModal('signin')">
            <i class="fas fa-sign-in-alt"></i>
            Sign In
          </button>
        `;
      }
    });
  }

  openAuthModal(mode = 'signin') {
    // Check if modal exists, create if not
    let modal = document.getElementById('auth-modal');
    
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'auth-modal';
      modal.className = 'modal-overlay';
      modal.innerHTML = `
        <div class="modal" style="width: 400px">
          <div class="modal-header">
            <h3 class="modal-title" id="auth-modal-title">Sign In</h3>
            <button class="modal-close" onclick="Utils.modal.close('auth-modal')">
              <i class="fas fa-times"></i>
            </button>
          </div>
          <div class="modal-body">
            <div class="flex gap-sm mb-3">
              <button class="btn btn-outline flex-1 auth-tab" data-tab="signin" onclick="AuthManager.switchAuthTab('signin')">
                Sign In
              </button>
              <button class="btn btn-outline flex-1 auth-tab" data-tab="signup" onclick="AuthManager.switchAuthTab('signup')">
                Sign Up
              </button>
            </div>
            
            <!-- Sign In Form -->
            <form id="signin-form" class="auth-form" onsubmit="AuthManager.handleSignIn(event)">
              <div class="form-group">
                <label class="label">Email</label>
                <input type="email" name="email" class="input" required />
              </div>
              <div class="form-group">
                <label class="label">Password</label>
                <input type="password" name="password" class="input" required />
              </div>
              <button type="submit" class="btn btn-primary w-full">Sign In</button>
              <p class="text-center text-sm text-secondary mt-2">
                <a href="#" onclick="AuthManager.openResetPassword(event)" class="text-cyan hover:text-purple">Forgot password?</a>
              </p>
            </form>
            
            <!-- Sign Up Form -->
            <form id="signup-form" class="auth-form hidden" onsubmit="AuthManager.handleSignUp(event)">
              <div class="form-group">
                <label class="label">Username</label>
                <input type="text" name="username" class="input" />
              </div>
              <div class="form-group">
                <label class="label">Email</label>
                <input type="email" name="email" class="input" required />
              </div>
              <div class="form-group">
                <label class="label">Password</label>
                <input type="password" name="password" class="input" required minlength="8" />
              </div>
              <button type="submit" class="btn btn-secondary w-full">Create Account</button>
            </form>
          </div>
        </div>
      `;
      document.body.appendChild(modal);
    }
    
    this.switchAuthTab(mode);
    Utils.modal.open('auth-modal');
  }

  switchAuthTab(tab) {
    const signinForm = document.getElementById('signin-form');
    const signupForm = document.getElementById('signup-form');
    const title = document.getElementById('auth-modal-title');
    const tabs = document.querySelectorAll('.auth-tab');
    
    tabs.forEach(t => {
      if (t.dataset.tab === tab) {
        t.classList.add('btn-primary');
        t.classList.remove('btn-outline');
      } else {
        t.classList.add('btn-outline');
        t.classList.remove('btn-primary');
      }
    });
    
    if (tab === 'signin') {
      signinForm.classList.remove('hidden');
      signupForm.classList.add('hidden');
      title.textContent = 'Sign In';
    } else {
      signinForm.classList.add('hidden');
      signupForm.classList.remove('hidden');
      title.textContent = 'Create Account';
    }
  }

  async handleSignIn(event) {
    event.preventDefault();
    const form = event.target;
    const email = form.email.value;
    const password = form.password.value;
    
    const loader = Utils.loading.show(form, 'Signing in...');
    
    const result = this.supabaseClient ? 
      await this.signIn(email, password) :
      await this.fallbackSignIn(email, password);
    
    Utils.loading.hide(loader);
    
    if (result.success) {
      Utils.modal.close('auth-modal');
      form.reset();
    }
  }

  async handleSignUp(event) {
    event.preventDefault();
    const form = event.target;
    const email = form.email.value;
    const password = form.password.value;
    const username = form.username.value;
    
    const loader = Utils.loading.show(form, 'Creating account...');
    
    const result = this.supabaseClient ?
      await this.signUp(email, password, username) :
      await this.fallbackSignUp(email, password, username);
    
    Utils.loading.hide(loader);
    
    if (result.success) {
      if (this.supabaseClient) {
        this.switchAuthTab('signin');
      } else {
        Utils.modal.close('auth-modal');
        form.reset();
      }
    }
  }

  openResetPassword(event) {
    event.preventDefault();
    
    const email = prompt('Enter your email address:');
    if (email && Utils.validate.email(email)) {
      this.resetPassword(email);
    }
  }

  toggleUserMenu(event) {
    event.stopPropagation();
    
    // Check if menu exists
    let menu = document.getElementById('user-dropdown-menu');
    
    if (menu) {
      menu.remove();
      return;
    }
    
    // Create menu
    menu = document.createElement('div');
    menu.id = 'user-dropdown-menu';
    menu.className = 'absolute top-full right-0 mt-2 w-48 card fade-in';
    menu.style.cssText = 'z-index: 1000;';
    
    const user = AppState.getUser();
    const isClaimed = Object.values(AppState.getClaims()).includes(user.email || user.name);
    
    menu.innerHTML = `
      <a href="/pages/profile" class="nav-item">
        <i class="fas fa-user"></i>
        <span>Profile</span>
      </a>
      ${isClaimed ? `
        <a href="/pages/dashboard" class="nav-item">
          <i class="fas fa-chart-line"></i>
          <span>Dashboard</span>
        </a>
      ` : ''}
      <a href="/pages/settings" class="nav-item">
        <i class="fas fa-cog"></i>
        <span>Settings</span>
      </a>
      <div class="border-t border-default my-2"></div>
      <button class="nav-item w-full text-left" onclick="AuthManager.signOut()">
        <i class="fas fa-sign-out-alt"></i>
        <span>Sign Out</span>
      </button>
    `;
    
    event.currentTarget.style.position = 'relative';
    event.currentTarget.appendChild(menu);
    
    // Close menu on outside click
    setTimeout(() => {
      document.addEventListener('click', function closeMenu() {
        menu?.remove();
        document.removeEventListener('click', closeMenu);
      });
    }, 0);
  }

  openNotifications() {
    Utils.toast.info('Notifications feature coming soon!');
  }

  // ============================================
  // HELPER METHODS
  // ============================================
  isAuthenticated() {
    return AppState.isAuthenticated();
  }

  requireAuth(redirectTo = '/') {
    if (!this.isAuthenticated()) {
      window.location.href = redirectTo;
      return false;
    }
    return true;
  }

  onAuthStateChange(callback) {
    this.authStateListeners.push(callback);
  }

  notifyAuthStateChange(event, user = null) {
    this.authStateListeners.forEach(callback => {
      try {
        callback(event, user);
      } catch (error) {
        console.error('[AuthManager] Listener error:', error);
      }
    });
  }
}

// Create global instance
const AuthManager = new AuthManager();

// Make available globally
window.AuthManager = AuthManager;
