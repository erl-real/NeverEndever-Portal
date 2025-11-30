import { supabase } from './core.js'

document.addEventListener("DOMContentLoaded", () => {
  const logoutBtn = document.getElementById("logout-btn")
  if (logoutBtn) {
    logoutBtn.addEventListener("click", async () => {
      const { error } = await supabase.auth.signOut()
      if (error) {
        alert("Logout failed: " + error.message)
      } else {
        window.location.href = "/pages/login.html"
      }
    })
  }
})
