<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>NeverEndever | Sidebar Template</title>

  <!-- Supabase UMD (browser-ready). Keep only this one UMD script on the page. -->
  <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js"></script>

  <!-- Font Awesome (CDN may be blocked by tracking prevention in some browsers) -->
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">

  <style>
    :root {
      --bg-app: #050505;
      --bg-panel: #0a0a0e;
      --border: rgba(255,255,255,0.08);
      --text-main: #f0f0f0;
      --text-muted: #9ca3af;
      --emerald: #00f5d4;
      --purple: #9d4edd;
      --sidebar-width: 260px;
      --sidebar-width-collapsed: 80px;
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      display: flex;
      flex-direction: column;
      min-height: 100vh;
      background: #0a0a0f;
      color: var(--text-main);
      font-family: Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
    }
    body::before {
      content: "";
      position: fixed;
      inset: 0;
      z-index: -1;
      background-image: url('/assets/images/test-bg.jpg');
      background-size: cover;
      background-position: center;
      background-repeat: no-repeat;
      opacity: 0.2;
    }

    .page-wrapper { display: flex; flex-direction: column; min-height: 100vh; }
    .layout { display: flex; flex: 1; }

    .sidebar {
      width: var(--sidebar-width);
      background: var(--bg-panel);
      border-right: 1px solid var(--border);
      padding: 20px;
      display: flex;
      flex-direction: column;
      transition: width 0.25s ease;
      position: relative;
      white-space: nowrap;
      z-index: 900;
    }
    .sidebar-header { display: flex; align-items: center; justify-content: space-between; height: 40px; margin-bottom: 20px; }
    .brand { display: flex; align-items: center; gap: 10px; font-weight: 800; background: linear-gradient(to right, var(--purple), var(--emerald)); -webkit-background-clip: text; background-clip: text; color: transparent; }
    .sidebar-toggle-btn { color: var(--text-muted); cursor: pointer; font-size: 0.95rem; padding: 6px; border-radius: 6px; transition: 0.2s; user-select: none; }
    .sidebar-toggle-btn:hover { color: #fff; background: rgba(255,255,255,0.08); }

    .nav-list { display: flex; flex-direction: column; gap: 6px; }
    .nav-item { display: flex; align-items: center; gap: 12px; padding: 12px 14px; border-radius: 8px; color: var(--text-muted); text-decoration: none; transition: 0.2s; }
    .nav-item i { width: 20px; text-align: center; }
    .nav-item:hover { color: #fff; background: rgba(255,255,255,0.06); }
    .nav-item.active { color: #0490a2; background: rgba(25, 8, 38,0.32); font-weight: 700; }

    .sidebar.collapsed { width: var(--sidebar-width-collapsed); }
    .sidebar.collapsed .brand span { display: none; }
    .sidebar.collapsed .nav-item { justify-content: center; }
    .sidebar.collapsed .nav-item span { display: none; }
    .sidebar.collapsed .sidebar-toggle-btn i { transform: rotate(180deg); transition: transform 0.25s ease; }

    .main { flex: 1; padding: 2rem; overflow-y: auto; overflow-x: hidden; }

    .auth-modal { position: fixed; inset: 0; background: rgba(0,0,0,0.85); display: none; align-items: center; justify-content: center; z-index: 1000; }
    .auth-box { width: 360px; max-width: 90vw; background: #0a0a0f; border: 1px solid var(--purple); padding: 24px; border-radius: 12px; }
    .auth-input { width: 100%; padding: 10px 12px; margin: 8px 0; border: 1px solid var(--border); border-radius: 8px; background: #000; color: #fff; }
    .btn { width: 100%; padding: 12px; border: none; border-radius: 8px; font-weight: 700; cursor: pointer; }
    .btn-primary { background: var(--emerald); color: #000; }
    .btn-outline { background: transparent; color: var(--text-muted); border: 1px solid var(--border); margin-top: 8px; }

    .scan-overlay { position: absolute; inset: 0; background: linear-gradient(transparent 50%, rgba(33, 33, 33, 0.05) 50%); background-size: 100% 4px; z-index: 2; pointer-events: none; }
    .noise-overlay { position: absolute; inset: 0; background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.1'/%3E%3C/svg%3E"); opacity: 0.05; z-index: 1; pointer-events: none; }

    .auth-status { font-size: 0.9rem; margin-top: 8px; color: #ff6b6b; }
    .auth-status.success { color: #00f5d4; }
  </style>
</head>
<body>
  <div class="page-wrapper">
    <div class="layout">
      <nav id="sidebar" class="sidebar">
        <div class="sidebar-header">
          <div class="brand">
            <img src="/assets/endeverlogovector.svg" alt="NeverEndever Logo" width="32" height="32">
            <span>NeverEndever</span>
          </div>
          <div class="sidebar-toggle-btn" onclick="App.toggleSidebar()">
            <i class="fas fa-chevron-left"></i>
          </div>
        </div>
        <div class="nav-list" id="nav-list"></div>
      </nav>


    </div>
      </div>

      <div class="sesh-ticker">
        <div class="ticker-content">
          derrotekonige · adrian_black · underground808live · ca1attano · zeek_music · decembersblunt · neenemee · undergroundogz · kxtxxxendever · waitedboat4 · bigjibbah · bettyboid · 22panic_spotify · thenamesdefault · ironkasper · jamesryanmusic33 · thatboiakk
        </div>
      </div>
    </div>
  </div>

  <!-- old loginoverlay - kept for reference
  <div id="login-overlay" class="auth-modal" aria-hidden="true">
    <div class="auth-box" role="dialog" aria-modal="true" aria-labelledby="login-title">
      <h2 id="login-title" style="margin:0 0 8px 0;">IDENTITY REQUIRED</h2>

      <form id="overlay-login-form" autocomplete="on">
        <input id="overlay-login-email" class="auth-input" type="email" placeholder="Email" required />
        <input id="overlay-login-pass" class="auth-input" type="password" placeholder="Password" required />
        <button id="overlay-btn-login" class="btn btn-primary" type="submit">Login</button>
        <button id="overlay-btn-signup" type="button" class="btn btn-outline" style="margin-top:8px;">Sign Up</button>
        <button id="overlay-btn-cancel" type="button" class="btn btn-outline" style="margin-top:8px;">Cancel</button>
        <div id="overlay-login-status" class="auth-status" role="status" aria-live="polite"></div>
      </form>
    </div>
  </div>  -->

  <script>
    /* -------------------------
       Supabase initialization
       - Fetches /config (server must return JSON with SUPABASE_URL and SUPABASE_ANON_KEY)
       - Creates window.supabaseClient once
       ------------------------- */
    async function initSupabaseFromServerConfig() {
      try {
        const res = await fetch('/config', { cache: 'no-store' });
        if (!res.ok) throw new Error('Config fetch failed: ' + res.status);
        const cfg = await res.json();
        if (!cfg.SUPABASE_URL || !cfg.SUPABASE_ANON_KEY) throw new Error('Config missing keys');

        if (window.supabase && typeof window.supabase.createClient === 'function') {
          if (!window.supabaseClient) {
            window.supabaseClient = window.supabase.createClient(cfg.SUPABASE_URL, cfg.SUPABASE_ANON_KEY);
            console.log('Supabase initialized from /config');
          } else {
            console.log('Supabase client already exists; skipping creation');
          }
        } else {
          throw new Error('Supabase library not loaded');
        }
      } catch (err) {
        console.error('Failed to initialize Supabase:', err);
        const statusEl = document.getElementById('overlay-login-status');
        if (statusEl) statusEl.textContent = 'Unable to initialize auth. Try again later.';
      }
    }
    initSupabaseFromServerConfig();

    /* -------------------------
       App + Auth helpers
       ------------------------- */
    window.App = {
      toggleSidebar() {
        const el = document.getElementById('sidebar');
        if (!el) return;
        el.classList.toggle('collapsed');
      }
    };

    const Auth = {
      openLoginOverlay() {
        const overlay = document.getElementById('login-overlay');
        if (!overlay) return;
        overlay.style.display = 'flex';
        overlay.setAttribute('aria-hidden', 'false');
        setTimeout(() => document.getElementById('overlay-login-email')?.focus(), 50);
      },
      closeLoginOverlay() {
        const overlay = document.getElementById('login-overlay');
        if (!overlay) return;
        overlay.style.display = 'none';
        overlay.setAttribute('aria-hidden', 'true');
        const status = document.getElementById('overlay-login-status');
        if (status) { status.textContent = ''; status.classList.remove('success'); }
        const pass = document.getElementById('overlay-login-pass');
        if (pass) pass.value = '';
      },
      logout() {
        localStorage.removeItem('endever_user');
        location.reload();
      }
    };

    /* -------------------------
       Navigation (inlined to avoid missing /nav.js)
       ------------------------- */
    const NAV_CONFIG = {
      public: [
        { label: "Home", icon: "fa-home", href: "/index.html" },
        { label: "ELO Rankings", icon: "fa-trophy", href: "/elo/index.html" },
        { label: "AI Protocol", icon: "fa-microchip", href: "/pages/endeverai/index.html" },
        { label: "Community", icon: "fa-comments", href: "/pages/messageboard/index.html" },
        { label: "Events", icon: "fa-calendar-alt", href: "/pages/events/index.html" },
        { label: "About", icon: "fa-info-circle", href: "/pages/about/index.html" },
        { label: "Contact", icon: "fa-envelope", href: "/pages/contact/index.html" },
        { label: "Login", icon: "fa-sign-in-alt", href: "/pages/login.html" }
      ],
      loggedIn: {
        artist: [
          { label: "Artist Dashboard", icon: "fa-user-astronaut", href: "/pages/dashboard/index.html" },
          { label: "Tracks", icon: "fa-music", href: "/pages/dashboard/tracks.html" },
          { label: "Analytics", icon: "fa-chart-bar", href: "/pages/dashboard/analytics.html" },
          { label: "Settings", icon: "fa-cog", href: "/pages/dashboard/settings.html" }
        ],
        staff: [
          { label: "Staff Dashboard", icon: "fa-briefcase", href: "/pages/staff/index.html" },
          { label: "Moderation", icon: "fa-shield-alt", href: "/pages/staff/moderation.html" },
          { label: "Reports", icon: "fa-file-alt", href: "/pages/staff/reports.html" }
        ],
        admin: [
          { label: "Admin Panel", icon: "fa-tools", href: "/pages/admin/index.html" },
          { label: "User Management", icon: "fa-users", href: "/pages/admin/users.html" },
          { label: "System Settings", icon: "fa-cogs", href: "/pages/admin/settings.html" },
          { label: "Reports", icon: "fa-file-alt", href: "/pages/admin/reports.html" }
        ],
        shared: [
          { label: "Profile", icon: "fa-user", href: "/pages/profile/index.html" },
          { label: "Community", icon: "fa-comments", href: "/pages/messageboard/index.html" },
          { label: "Events", icon: "fa-calendar-alt", href: "/pages/events/index.html" },
          { label: "Logout", icon: "fa-sign-out-alt", action: () => Auth.logout() }
        ]
      }
    };

    function renderNav(user) {
      const container = document.getElementById('nav-list');
      if (!container) return;
      container.innerHTML = '';
      let navItems;
      if (!user) navItems = NAV_CONFIG.public;
      else {
        const role = user.role;
        const roleItems = NAV_CONFIG.loggedIn[role] || [];
        const sharedItems = NAV_CONFIG.loggedIn.shared || [];
        navItems = roleItems.length ? [...roleItems, ...sharedItems] : NAV_CONFIG.public;
      }

      navItems.forEach(item => {
        const a = document.createElement('a');
        a.className = 'nav-item';
        a.innerHTML = `<i class="fas ${item.icon}"></i><span>${item.label}</span>`;
        a.href = item.href || 'javascript:void(0)';
        if (item.action) a.addEventListener('click', item.action);
        container.appendChild(a);
      });

      // highlight active by pathname
      const currentPath = location.pathname.replace(/\/+$/, '') || '/';
      [...container.querySelectorAll('.nav-item')].forEach(link => {
        try {
          const linkPath = new URL(link.href, location.origin).pathname.replace(/\/+$/, '') || '/';
          if (linkPath === currentPath) link.classList.add('active');
        } catch (e) {}
      });
    }

    /* -------------------------
       Login overlay behavior (uses window.supabaseClient)
       ------------------------- */
    async function handleOverlayLogin(e) {
      e.preventDefault();
      const statusEl = document.getElementById('overlay-login-status');
      const email = document.getElementById('overlay-login-email').value.trim();
      const password = document.getElementById('overlay-login-pass').value;

      if (!email || !password) {
        statusEl.textContent = 'Please enter both email and password.';
        statusEl.classList.remove('success');
        return;
      }

      if (!window.supabaseClient) {
        statusEl.textContent = 'Auth client not initialized. Please wait.';
        statusEl.classList.remove('success');
        return;
      }

      statusEl.textContent = 'Signing in…';
      statusEl.classList.remove('success');

      try {
        const { data, error } = await window.supabaseClient.auth.signInWithPassword({ email, password });
        if (error) {
          statusEl.textContent = error.message || 'Sign-in failed. Check credentials.';
          statusEl.classList.remove('success');
          return;
        }

        const userObj = { id: data.user?.id || null, email: data.user?.email || email, role: data.user?.role || null };
        localStorage.setItem('endever_user', JSON.stringify(userObj));

        statusEl.textContent = 'Signed in successfully.';
        statusEl.classList.add('success');

        setTimeout(() => {
          Auth.closeLoginOverlay();
          renderNav(userObj);
        }, 700);
      } catch (err) {
        statusEl.textContent = err?.message || 'Unexpected error during sign-in.';
        statusEl.classList.remove('success');
        console.error(err);
      }
    }

    function handleOverlaySignup() {
      window.location.href = '/pages/signup.html';
    }

    /* -------------------------
       DOM ready wiring
       ------------------------- */
    document.addEventListener('DOMContentLoaded', () => {
      const userStr = localStorage.getItem('endever_user');
      const user = userStr ? JSON.parse(userStr) : null;
      renderNav(user);

      document.getElementById('overlay-login-form')?.addEventListener('submit', handleOverlayLogin);
      document.getElementById('overlay-btn-cancel')?.addEventListener('click', Auth.closeLoginOverlay);
      document.getElementById('overlay-btn-signup')?.addEventListener('click', handleOverlaySignup);

      const ticker = document.querySelector('.ticker-content');
      if (ticker) ticker.style.transform = `translateX(${Math.random() * 100}%)`;
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') Auth.closeLoginOverlay();
    });
  </script>

  <!-- Remove other Supabase imports or duplicate createClient calls in other files.
       If you have /scripts/script.js or /scripts/auth.js, ensure they DO NOT call createClient again.
       If you prefer to keep them, open those files and replace any createClient(...) with:
         if (!window.supabaseClient) { /* create or wait */ }
  -->
<script type="module" src="/scripts/login.js"></script>
  <script type="module" src="../scripts/signup.js"></script>
</body>
</html>
