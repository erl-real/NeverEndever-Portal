/**
 * NEVERENDEVER PORTAL - UTILITIES
 * Common UI functions and helpers
 */

const Utils = {
  // ============================================
  // TOAST NOTIFICATIONS
  // ============================================
  toast: {
    container: null,
    
    init() {
      if (!this.container) {
        this.container = document.createElement('div');
        this.container.className = 'toast-container';
        document.body.appendChild(this.container);
      }
    },
    
    show(message, type = 'info', duration = 3000) {
      this.init();
      
      const toast = document.createElement('div');
      toast.className = `toast toast-${type} fade-in`;
      
      const iconMap = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle',
        warning: 'fa-exclamation-triangle',
        info: 'fa-info-circle'
      };
      
      toast.innerHTML = `
        <i class="fas ${iconMap[type]}"></i>
        <span>${message}</span>
        <button class="btn-icon btn-sm" onclick="this.parentElement.remove()">
          <i class="fas fa-times"></i>
        </button>
      `;
      
      this.container.appendChild(toast);
      
      if (duration > 0) {
        setTimeout(() => {
          toast.style.opacity = '0';
          setTimeout(() => toast.remove(), 300);
        }, duration);
      }
      
      return toast;
    },
    
    success(message, duration) {
      return this.show(message, 'success', duration);
    },
    
    error(message, duration) {
      return this.show(message, 'error', duration);
    },
    
    warning(message, duration) {
      return this.show(message, 'warning', duration);
    },
    
    info(message, duration) {
      return this.show(message, 'info', duration);
    }
  },

  // ============================================
  // MODAL MANAGEMENT
  // ============================================
  modal: {
    open(modalId) {
      const modal = document.getElementById(modalId);
      if (modal) {
        modal.classList.add('open');
        document.body.style.overflow = 'hidden';
      }
    },
    
    close(modalId) {
      const modal = document.getElementById(modalId);
      if (modal) {
        modal.classList.remove('open');
        document.body.style.overflow = '';
      }
    },
    
    closeAll() {
      document.querySelectorAll('.modal-overlay.open').forEach(modal => {
        modal.classList.remove('open');
      });
      document.body.style.overflow = '';
    },
    
    create(options) {
      const {
        id = 'modal-' + Date.now(),
        title = '',
        content = '',
        footer = '',
        onClose = null,
        width = '600px'
      } = options;
      
      const overlay = document.createElement('div');
      overlay.id = id;
      overlay.className = 'modal-overlay';
      overlay.innerHTML = `
        <div class="modal" style="width: ${width}">
          <div class="modal-header">
            <h3 class="modal-title">${title}</h3>
            <button class="modal-close" onclick="Utils.modal.close('${id}')">
              <i class="fas fa-times"></i>
            </button>
          </div>
          <div class="modal-body">${content}</div>
          ${footer ? `<div class="modal-footer">${footer}</div>` : ''}
        </div>
      `;
      
      document.body.appendChild(overlay);
      
      // Close on overlay click
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
          this.close(id);
          if (onClose) onClose();
        }
      });
      
      // Close on Escape
      const escapeHandler = (e) => {
        if (e.key === 'Escape') {
          this.close(id);
          if (onClose) onClose();
          document.removeEventListener('keydown', escapeHandler);
        }
      };
      document.addEventListener('keydown', escapeHandler);
      
      return overlay;
    },
    
    confirm(message, onConfirm, onCancel) {
      const modal = this.create({
        title: 'Confirm',
        content: `<p>${message}</p>`,
        footer: `
          <button class="btn btn-outline" onclick="Utils.modal.close('${modal.id}'); if(${onCancel}) ${onCancel}()">Cancel</button>
          <button class="btn btn-primary" onclick="Utils.modal.close('${modal.id}'); if(${onConfirm}) ${onConfirm}()">Confirm</button>
        `,
        width: '400px'
      });
      this.open(modal.id);
    }
  },

  // ============================================
  // LOADING STATES
  // ============================================
  loading: {
    show(target = document.body, message = 'Loading...') {
      const loader = document.createElement('div');
      loader.className = 'loading-overlay';
      loader.innerHTML = `
        <div class="flex flex-col items-center gap-md">
          <div class="spinner"></div>
          <p class="text-secondary">${message}</p>
        </div>
      `;
      loader.style.cssText = `
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
      `;
      target.appendChild(loader);
      return loader;
    },
    
    hide(loader) {
      if (loader && loader.parentElement) {
        loader.remove();
      }
    }
  },

  // ============================================
  // FORM VALIDATION
  // ============================================
  validate: {
    email(email) {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return re.test(email);
    },
    
    password(password, minLength = 8) {
      return password.length >= minLength;
    },
    
    required(value) {
      return value !== null && value !== undefined && value.trim() !== '';
    },
    
    url(url) {
      try {
        new URL(url);
        return true;
      } catch {
        return false;
      }
    }
  },

  // ============================================
  // DOM HELPERS
  // ============================================
  dom: {
    ready(callback) {
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', callback);
      } else {
        callback();
      }
    },
    
    createElement(tag, className = '', attributes = {}) {
      const el = document.createElement(tag);
      if (className) el.className = className;
      Object.entries(attributes).forEach(([key, value]) => {
        el.setAttribute(key, value);
      });
      return el;
    },
    
    hide(selector) {
      const el = typeof selector === 'string' ? document.querySelector(selector) : selector;
      if (el) el.classList.add('hidden');
    },
    
    show(selector) {
      const el = typeof selector === 'string' ? document.querySelector(selector) : selector;
      if (el) el.classList.remove('hidden');
    },
    
    toggle(selector) {
      const el = typeof selector === 'string' ? document.querySelector(selector) : selector;
      if (el) el.classList.toggle('hidden');
    }
  },

  // ============================================
  // DATA FORMATTING
  // ============================================
  format: {
    date(date, format = 'short') {
      const d = new Date(date);
      if (isNaN(d)) return 'Invalid Date';
      
      const formats = {
        short: { year: 'numeric', month: 'short', day: 'numeric' },
        long: { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' },
        time: { hour: '2-digit', minute: '2-digit' }
      };
      
      return d.toLocaleDateString('en-US', formats[format] || formats.short);
    },
    
    number(num, decimals = 0) {
      return Number(num).toFixed(decimals);
    },
    
    currency(amount, currency = 'USD') {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency
      }).format(amount);
    },
    
    fileSize(bytes) {
      const sizes = ['Bytes', 'KB', 'MB', 'GB'];
      if (bytes === 0) return '0 Bytes';
      const i = Math.floor(Math.log(bytes) / Math.log(1024));
      return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
    },
    
    truncate(text, length = 100, suffix = '...') {
      if (text.length <= length) return text;
      return text.substring(0, length - suffix.length) + suffix;
    }
  },

  // ============================================
  // URL & QUERY STRING
  // ============================================
  url: {
    getParam(name) {
      const params = new URLSearchParams(window.location.search);
      return params.get(name);
    },
    
    setParam(name, value) {
      const url = new URL(window.location.href);
      url.searchParams.set(name, value);
      window.history.pushState({}, '', url);
    },
    
    removeParam(name) {
      const url = new URL(window.location.href);
      url.searchParams.delete(name);
      window.history.pushState({}, '', url);
    },
    
    getAllParams() {
      const params = new URLSearchParams(window.location.search);
      return Object.fromEntries(params);
    }
  },

  // ============================================
  // DEBOUNCE & THROTTLE
  // ============================================
  debounce(func, wait = 300) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },

  throttle(func, limit = 300) {
    let inThrottle;
    return function(...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  },

  // ============================================
  // COPY TO CLIPBOARD
  // ============================================
  async copyToClipboard(text) {
    try {
      await navigator.clipboard.writeText(text);
      this.toast.success('Copied to clipboard!');
      return true;
    } catch (err) {
      this.toast.error('Failed to copy');
      return false;
    }
  },

  // ============================================
  // RANDOM ID GENERATOR
  // ============================================
  generateId(prefix = '') {
    return prefix + Math.random().toString(36).substring(2, 9);
  },

  // ============================================
  // SLEEP/DELAY
  // ============================================
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  },

  // ============================================
  // ARRAY HELPERS
  // ============================================
  array: {
    shuffle(array) {
      const arr = [...array];
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
      return arr;
    },
    
    unique(array) {
      return [...new Set(array)];
    },
    
    chunk(array, size) {
      const chunks = [];
      for (let i = 0; i < array.length; i += size) {
        chunks.push(array.slice(i, i + size));
      }
      return chunks;
    },
    
    groupBy(array, key) {
      return array.reduce((result, item) => {
        const group = item[key];
        if (!result[group]) result[group] = [];
        result[group].push(item);
        return result;
      }, {});
    }
  },

  // ============================================
  // LOCAL STORAGE HELPERS
  // ============================================
  storage: {
    set(key, value) {
      try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
      } catch (e) {
        console.error('Storage error:', e);
        return false;
      }
    },
    
    get(key, defaultValue = null) {
      try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
      } catch (e) {
        return defaultValue;
      }
    },
    
    remove(key) {
      localStorage.removeItem(key);
    },
    
    clear() {
      localStorage.clear();
    }
  },

  // ============================================
  // ANIMATION HELPERS
  // ============================================
  animate: {
    fadeIn(element, duration = 300) {
      element.style.opacity = '0';
      element.style.display = 'block';
      
      let start = null;
      const step = (timestamp) => {
        if (!start) start = timestamp;
        const progress = timestamp - start;
        element.style.opacity = Math.min(progress / duration, 1);
        
        if (progress < duration) {
          window.requestAnimationFrame(step);
        }
      };
      
      window.requestAnimationFrame(step);
    },
    
    fadeOut(element, duration = 300) {
      let start = null;
      const step = (timestamp) => {
        if (!start) start = timestamp;
        const progress = timestamp - start;
        element.style.opacity = 1 - Math.min(progress / duration, 1);
        
        if (progress < duration) {
          window.requestAnimationFrame(step);
        } else {
          element.style.display = 'none';
        }
      };
      
      window.requestAnimationFrame(step);
    }
  },

  // ============================================
  // SCORE COLOR GRADIENT
  // ============================================
  scoreColor(score, minScore = 5, maxScore = 10) {
    const normalized = Math.min(1, Math.max(0, (score - minScore) / (maxScore - minScore)));
    
    // Low color (Bronze: #d97706)
    const low = { r: 217, g: 119, b: 6 };
    // High color (Cyan: #00f5d4)
    const high = { r: 0, g: 245, b: 212 };
    
    const r = Math.round(low.r + (high.r - low.r) * normalized);
    const g = Math.round(low.g + (high.g - low.g) * normalized);
    const b = Math.round(low.b + (high.b - low.b) * normalized);
    
    return `rgb(${r}, ${g}, ${b})`;
  },

  // ============================================
  // PLATFORM DETECTION
  // ============================================
  getPlatform(url) {
    if (!url) return { name: 'Unknown', icon: 'fas fa-link', color: '#888' };
    
    const lowerUrl = url.toLowerCase();
    
    if (lowerUrl.includes('youtube.com') || lowerUrl.includes('youtu.be')) {
      return { name: 'YouTube', icon: 'fab fa-youtube', color: '#FF0000' };
    }
    if (lowerUrl.includes('spotify.com')) {
      return { name: 'Spotify', icon: 'fab fa-spotify', color: '#1DB954' };
    }
    if (lowerUrl.includes('soundcloud.com')) {
      return { name: 'SoundCloud', icon: 'fab fa-soundcloud', color: '#FF5500' };
    }
    if (lowerUrl.includes('apple.com') || lowerUrl.includes('music.apple')) {
      return { name: 'Apple Music', icon: 'fab fa-apple', color: '#FC3C44' };
    }
    if (lowerUrl.includes('tidal.com')) {
      return { name: 'Tidal', icon: 'fas fa-music', color: '#00FFFF' };
    }
    
    return { name: 'External', icon: 'fas fa-external-link-alt', color: '#888' };
  }
};

// Make available globally
window.Utils = Utils;
