/**
 * NEVERENDEVER PORTAL - STATE MANAGER
 * Unified state management across all pages
 * Handles: User auth, settings, preferences, caching
 */

class StateManager {
  constructor() {
    this.storagePrefix = 'endever_';
    this.state = {
      user: null,
      settings: this.defaultSettings(),
      cache: {},
      session: {}
    };
    
    this.init();
  }

  // ============================================
  // INITIALIZATION
  // ============================================
  init() {
    this.loadState();
    this.setupListeners();
    console.log('[StateManager] Initialized', this.state);
  }

  defaultSettings() {
    return {
      theme: 'dark',
      sidebarCollapsed: false,
      notifications: {
        enabled: true,
        sound: true,
        desktop: false
      },
      appearance: {
        animations: true,
        reducedMotion: false,
        fontSize: 'medium'
      },
      privacy: {
        profileVisible: true,
        showActivity: true,
        allowMessages: true
      },
      preferences: {
        autoPlay: false,
        defaultView: 'grid',
        itemsPerPage: 20
      }
    };
  }

  setupListeners() {
    // Listen for storage changes from other tabs
    window.addEventListener('storage', (e) => {
      if (e.key && e.key.startsWith(this.storagePrefix)) {
        this.loadState();
        this.notifyListeners('storageUpdate', e.key);
      }
    });

    // Listen for beforeunload to save state
    window.addEventListener('beforeunload', () => {
      this.saveState();
    });
  }

  // ============================================
  // STATE PERSISTENCE
  // ============================================
  loadState() {
    try {
      // Load user
      const userData = localStorage.getItem(this.storagePrefix + 'user');
      if (userData) {
        this.state.user = JSON.parse(userData);
      }

      // Load settings
      const settingsData = localStorage.getItem(this.storagePrefix + 'settings');
      if (settingsData) {
        this.state.settings = { ...this.defaultSettings(), ...JSON.parse(settingsData) };
      }

      // Load cache
      const cacheData = localStorage.getItem(this.storagePrefix + 'cache');
      if (cacheData) {
        this.state.cache = JSON.parse(cacheData);
      }

      // Load session data
      const sessionData = sessionStorage.getItem(this.storagePrefix + 'session');
      if (sessionData) {
        this.state.session = JSON.parse(sessionData);
      }
    } catch (error) {
      console.error('[StateManager] Error loading state:', error);
    }
  }

  saveState() {
    try {
      if (this.state.user) {
        localStorage.setItem(this.storagePrefix + 'user', JSON.stringify(this.state.user));
      } else {
        localStorage.removeItem(this.storagePrefix + 'user');
      }

      localStorage.setItem(this.storagePrefix + 'settings', JSON.stringify(this.state.settings));
      localStorage.setItem(this.storagePrefix + 'cache', JSON.stringify(this.state.cache));
      sessionStorage.setItem(this.storagePrefix + 'session', JSON.stringify(this.state.session));
    } catch (error) {
      console.error('[StateManager] Error saving state:', error);
    }
  }

  // ============================================
  // USER MANAGEMENT
  // ============================================
  setUser(user) {
    this.state.user = user;
    this.saveState();
    this.notifyListeners('userChanged', user);
  }

  getUser() {
    return this.state.user;
  }

  isAuthenticated() {
    return this.state.user !== null;
  }

  logout() {
    this.state.user = null;
    this.state.session = {};
    localStorage.removeItem(this.storagePrefix + 'user');
    sessionStorage.clear();
    this.notifyListeners('userLogout');
  }

  // ============================================
  // SETTINGS MANAGEMENT
  // ============================================
  getSetting(path) {
    const keys = path.split('.');
    let value = this.state.settings;
    
    for (const key of keys) {
      if (value === undefined) return undefined;
      value = value[key];
    }
    
    return value;
  }

  setSetting(path, value) {
    const keys = path.split('.');
    const lastKey = keys.pop();
    let target = this.state.settings;
    
    for (const key of keys) {
      if (!(key in target)) target[key] = {};
      target = target[key];
    }
    
    target[lastKey] = value;
    this.saveState();
    this.notifyListeners('settingChanged', { path, value });
  }

  updateSettings(updates) {
    this.state.settings = { ...this.state.settings, ...updates };
    this.saveState();
    this.notifyListeners('settingsUpdated', updates);
  }

  resetSettings() {
    this.state.settings = this.defaultSettings();
    this.saveState();
    this.notifyListeners('settingsReset');
  }

  // ============================================
  // CACHE MANAGEMENT
  // ============================================
  setCache(key, value, ttl = null) {
    this.state.cache[key] = {
      value,
      timestamp: Date.now(),
      ttl
    };
    this.saveState();
  }

  getCache(key) {
    const cached = this.state.cache[key];
    if (!cached) return null;

    // Check TTL
    if (cached.ttl && (Date.now() - cached.timestamp) > cached.ttl) {
      delete this.state.cache[key];
      this.saveState();
      return null;
    }

    return cached.value;
  }

  clearCache(key = null) {
    if (key) {
      delete this.state.cache[key];
    } else {
      this.state.cache = {};
    }
    this.saveState();
  }

  // ============================================
  // SESSION MANAGEMENT
  // ============================================
  setSessionData(key, value) {
    this.state.session[key] = value;
    sessionStorage.setItem(this.storagePrefix + 'session', JSON.stringify(this.state.session));
  }

  getSessionData(key) {
    return this.state.session[key];
  }

  clearSession() {
    this.state.session = {};
    sessionStorage.removeItem(this.storagePrefix + 'session');
  }

  // ============================================
  // EVENT SYSTEM
  // ============================================
  listeners = {};

  on(event, callback) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
  }

  off(event, callback) {
    if (!this.listeners[event]) return;
    this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
  }

  notifyListeners(event, data) {
    if (!this.listeners[event]) return;
    this.listeners[event].forEach(callback => {
      try {
        callback(data);
      } catch (error) {
        console.error(`[StateManager] Error in listener for ${event}:`, error);
      }
    });
  }

  // ============================================
  // UTILITY METHODS
  // ============================================
  exportState() {
    return JSON.stringify(this.state, null, 2);
  }

  importState(jsonString) {
    try {
      const imported = JSON.parse(jsonString);
      this.state = { ...this.state, ...imported };
      this.saveState();
      this.notifyListeners('stateImported');
      return true;
    } catch (error) {
      console.error('[StateManager] Error importing state:', error);
      return false;
    }
  }

  clearAll() {
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith(this.storagePrefix)) {
        localStorage.removeItem(key);
      }
    });
    sessionStorage.clear();
    this.state = {
      user: null,
      settings: this.defaultSettings(),
      cache: {},
      session: {}
    };
    this.notifyListeners('stateCleared');
  }

  // ============================================
  // SPECIFIC FEATURE HELPERS
  // ============================================
  
  // Likes management
  getLikes() {
    return this.getCache('likes') || [];
  }

  setLikes(likes) {
    this.setCache('likes', likes);
  }

  toggleLike(itemId) {
    const likes = this.getLikes();
    const index = likes.indexOf(itemId);
    
    if (index > -1) {
      likes.splice(index, 1);
    } else {
      likes.push(itemId);
    }
    
    this.setLikes(likes);
    this.notifyListeners('likeToggled', { itemId, liked: index === -1 });
    return index === -1;
  }

  isLiked(itemId) {
    return this.getLikes().includes(itemId);
  }

  // Playlist management
  getPlaylist() {
    return this.getCache('playlist') || [];
  }

  addToPlaylist(item) {
    const playlist = this.getPlaylist();
    if (!playlist.find(p => p.id === item.id)) {
      playlist.push(item);
      this.setCache('playlist', playlist);
      this.notifyListeners('playlistUpdated', playlist);
    }
  }

  removeFromPlaylist(itemId) {
    const playlist = this.getPlaylist();
    const filtered = playlist.filter(p => p.id !== itemId);
    this.setCache('playlist', filtered);
    this.notifyListeners('playlistUpdated', filtered);
  }

  clearPlaylist() {
    this.setCache('playlist', []);
    this.notifyListeners('playlistCleared');
  }

  // Artist claims
  getClaims() {
    return this.getCache('claims') || {};
  }

  claimArtist(artistName) {
    if (!this.isAuthenticated()) return false;
    
    const claims = this.getClaims();
    claims[artistName] = this.state.user.email || this.state.user.name;
    this.setCache('claims', claims);
    this.notifyListeners('artistClaimed', artistName);
    return true;
  }

  isClaimed(artistName) {
    const claims = this.getClaims();
    return artistName in claims;
  }

  isOwnedByCurrentUser(artistName) {
    if (!this.isAuthenticated()) return false;
    const claims = this.getClaims();
    const userIdentifier = this.state.user.email || this.state.user.name;
    return claims[artistName] === userIdentifier;
  }

  // Theme management
  getTheme() {
    return this.getSetting('theme') || 'dark';
  }

  setTheme(theme) {
    this.setSetting('theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
    this.notifyListeners('themeChanged', theme);
  }

  toggleTheme() {
    const current = this.getTheme();
    const newTheme = current === 'dark' ? 'light' : 'dark';
    this.setTheme(newTheme);
    return newTheme;
  }

  // Sidebar state
  getSidebarState() {
    return this.getSetting('sidebarCollapsed');
  }

  toggleSidebar() {
    const current = this.getSidebarState();
    this.setSetting('sidebarCollapsed', !current);
    this.notifyListeners('sidebarToggled', !current);
    return !current;
  }
}

// Create global instance
const AppState = new StateManager();

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { StateManager, AppState };
}
