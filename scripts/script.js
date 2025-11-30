// script.js
import { createClient } from '@supabase/supabase-js'

// Load from .env
const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

// Overlay elements
const overlay = document.getElementById('login-overlay')
const emailInput = document.getElementById('login-email')
const passInput = document.getElementById('login-pass')
const loginBtn = document.getElementById('btn-login')
const signupBtn = document.getElementById('btn-signup')
const cancelBtn = document.getElementById('btn-cancel')
const errorMsg = document.getElementById('login-error')

// Overlay helpers
const Auth = {
  openLoginOverlay() { overlay.style.display = 'flex' },
  closeLoginOverlay() { overlay.style.display = 'none' }
}

// script.js
import { createClient } from '@supabase/supabase-js'

// ⚠️ Use environment variables for security
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_KEY

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

// --- SIGNUP ---
const signupForm = document.getElementById('signup-form')
if (signupForm) {
  signupForm.addEventListener('submit', async (e) => {
    e.preventDefault()

    const email = document.getElementById('signup-email').value
    const password = document.getElementById('signup-password').value
    const status = document.getElementById('signup-status')

    const { data, error } = await supabase.auth.signUp({ email, password })

    if (error) {
      status.textContent = 'Signup failed: ' + error.message
      status.style.color = 'red'
    } else {
      status.textContent = 'Signup successful! Please check your email to confirm.'
      status.style.color = 'green'
    }
  })
}

// --- LOGIN ---
const loginForm = document.getElementById('login-form')
if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault()

    const email = document.getElementById('login-email').value
    const password = document.getElementById('login-password').value
    const status = document.getElementById('login-status')

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) {
      status.textContent = 'Login failed: ' + error.message
      status.style.color = 'red'
    } else {
      // ✅ Redirect to dashboard
      window.location.href = '/dashboard/index.html'
    }
  })
}

// Cancel button closes overlay
cancelBtn?.addEventListener('click', () => Auth.closeLoginOverlay())

// Session + Role check
async function checkSessionAndProfile() {
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) {
    console.warn('No active session')
    return
  }
  const user = session.user
  console.log('Active user:', user.email)
  const role = user.user_metadata?.role || 'user'
  console.log('Role:', role)
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()
  if (error) {
    console.error('Profile fetch error:', error.message)
  } else {
    console.log('Profile:', profile)
  }
}

// Persist session changes
supabase.auth.onAuthStateChange(async (event, session) => {
  if (event === 'SIGNED_IN') {
    console.log('User signed in:', session.user)
    await checkSessionAndProfile()
  }
  if (event === 'SIGNED_OUT') {
    console.log('User signed out')
  }
})
