// /scripts/auth.js
// Centralized authentication logic for Endever Live

import { supabase } from './core.js';

// Environment variables (set in mainkey.env or your hosting provider)
// In Vite/Next.js/etc. these are exposed as import.meta.env.VITE_SUPABASE_URL / KEY
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_KEY;

const sbClient = createClient(SUPABASE_URL, SUPABASE_KEY);

export const Auth = {
  async init() {
    const { data: { session } } = await sbClient.auth.getSession();
    if (session) {
      localStorage.setItem("endever_user", JSON.stringify({
        name: session.user.email,
        role: session.user.user_metadata?.role || "artist",
        credits: 0,
        avatar: session.user.user_metadata?.avatar || null
      }));
    } else {
      localStorage.removeItem("endever_user");
    }
  },

  async login(email, password) {
    const { data, error } = await sbClient.auth.signInWithPassword({ email, password });
    if (error) throw error;

    localStorage.setItem("endever_user", JSON.stringify({
      name: data.user.email,
      role: data.user.user_metadata?.role || "artist",
      credits: 0,
      avatar: data.user.user_metadata?.avatar || null
    }));
    return data.user;
  },

  async signup(email, password, role = "artist") {
    const { data, error } = await sbClient.auth.signUp({
      email,
      password,
      options: { data: { role } }
    });
    if (error) throw error;

    localStorage.setItem("endever_user", JSON.stringify({
      name: data.user.email,
      role,
      credits: 0
    }));
    return data.user;
  },

  async logout() {
    await sbClient.auth.signOut();
    localStorage.removeItem("endever_user");
    location.reload();
  },

  openLoginOverlay() {
    const overlay = document.getElementById("login-overlay");
    if (overlay) overlay.style.display = "flex";
  },

  closeLoginOverlay() {
    const overlay = document.getElementById("login-overlay");
    if (overlay) overlay.style.display = "none";
  },

  setupOverlay() {
    const loginBtn = document.getElementById("btn-login");
    if (loginBtn) {
      loginBtn.onclick = async () => {
        const email = document.getElementById("login-email").value;
        const pass = document.getElementById("login-pass").value;
        try {
          await this.login(email, pass);
          this.closeLoginOverlay();
          location.reload();
        } catch (err) {
          document.getElementById("login-error").innerText = err.message;
        }
      };
    }

    const cancelBtn = document.getElementById("btn-cancel");
    if (cancelBtn) cancelBtn.onclick = () => this.closeLoginOverlay();
  }
};

// Initialize on page load
document.addEventListener("DOMContentLoaded", () => {
  Auth.init();
  Auth.setupOverlay();
});

