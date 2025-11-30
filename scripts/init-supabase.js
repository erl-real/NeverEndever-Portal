// scripts/init-supabase.js
// Robust Supabase init: tries /config, falls back to http://localhost:3001/config.
// Exposes window.supabaseClient and window.supabaseReady.

(function () {
  if (window.supabaseClient) {
    window.supabaseReady = Promise.resolve(window.supabaseClient);
    return;
  }

  let resolveReady, rejectReady;
  window.supabaseReady = new Promise((resolve, reject) => { resolveReady = resolve; rejectReady = reject; });

  async function fetchConfig(url) {
    try {
      const res = await fetch(url, { cache: 'no-store' });
      if (!res.ok) return { ok: false, text: await res.text().catch(() => '') };
      const text = await res.text();
      return { ok: true, text };
    } catch (err) {
      return { ok: false, text: '' };
    }
  }

  async function init() {
    try {
      // Try same-origin /config first
      let result = await fetchConfig('/config');

      // If server returned HTML (Vite fallback) or not ok, try common backend port
      if (!result.ok || result.text.trim().startsWith('<')) {
        // try Express on 3001 (adjust if your backend runs on another port)
        result = await fetchConfig('http://localhost:3001/config');
      }

      if (!result.ok) {
        rejectReady(new Error('/config not available'));
        console.warn('Supabase config not available from /config or fallback.');
        return;
      }

      const text = result.text;
      if (text.trim().startsWith('<')) {
        rejectReady(new Error('/config returned HTML'));
        console.error('/config returned HTML; server route missing or wrong port.');
        return;
      }

      let cfg;
      try {
        cfg = JSON.parse(text);
      } catch (err) {
        rejectReady(new Error('Invalid JSON from /config'));
        console.error('Invalid JSON from /config', text.slice(0, 300));
        return;
      }

      if (!cfg.SUPABASE_URL || !cfg.SUPABASE_ANON_KEY) {
        rejectReady(new Error('Config missing keys'));
        console.error('Config missing SUPABASE_URL or SUPABASE_ANON_KEY', cfg);
        return;
      }

      if (!window.supabase || typeof window.supabase.createClient !== 'function') {
        rejectReady(new Error('Supabase UMD not loaded'));
        console.error('Supabase UMD not loaded; ensure the UMD script tag is present.');
        return;
      }

      if (!window.supabaseClient) {
        window.supabaseClient = window.supabase.createClient(cfg.SUPABASE_URL, cfg.SUPABASE_ANON_KEY);
        console.log('Supabase client created');
      }

      resolveReady(window.supabaseClient);
    } catch (err) {
      console.error('init supabase error', err);
      rejectReady(err);
    }
  }

  init();
})();
