// Run when the page loads: check if user is already signed in
document.addEventListener("DOMContentLoaded", async () => {
  const { data: { user } } = await supabase.auth.getUser();
  if (user) {
    showSession(user);
    loadProfile(user.id);
  }
});

// Login with email + password
async function emailLogin() {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    document.getElementById('error').textContent = error.message;
  } else {
    showSession(data.user);
    loadProfile(data.user.id);
  }
}

// Signup with email + password
async function emailSignup() {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  const { data, error } = await supabase.auth.signUp({ email, password });

  if (error) {
    document.getElementById('error').textContent = error.message;
  } else {
    document.getElementById('status').textContent = "Signup successful! Check your email.";
  }
}

// Logout
async function logout() {
  await supabase.auth.signOut();
  document.getElementById('session-panel').style.display = 'none';
  document.getElementById('profile-form').style.display = 'none';
  document.getElementById('auth-panel').style.display = 'block';
  document.getElementById('status').textContent = "";
  document.getElementById('error').textContent = "";
}

async function saveProfile() {
  const user = (await supabase.auth.getUser()).data.user;

  const profile = {
    id: user.id,
    username: document.getElementById('username').value,
    bio: document.getElementById('bio').value,
    genre: document.getElementById('genre').value,
    instagram: document.getElementById('instagram').value,
    soundcloud: document.getElementById('soundcloud').value,
    profile_image_url: document.getElementById('profile_image_url').value,
    elo_score: parseInt(document.getElementById('elo_score').value) || null
  };

  const { error } = await supabase.from('profiles').upsert(profile);

  if (error) {
    document.getElementById('error').textContent = error.message;
  } else {
    document.getElementById('status').textContent = "Profile saved!";
  }
}

// Load profile data into form when user logs in
async function loadProfile(userId) {
  const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single();

  if (error) {
    console.log("No profile yet or error:", error.message);
    return;
  }

  document.getElementById('username').value = data.username || "";
  document.getElementById('bio').value = data.bio || "";
  if (document.getElementById('genre')) document.getElementById('genre').value = data.genre || "";
  if (document.getElementById('instagram')) document.getElementById('instagram').value = data.instagram || "";
  if (document.getElementById('soundcloud')) document.getElementById('soundcloud').value = data.soundcloud || "";
  if (document.getElementById('profile_image_url')) document.getElementById('profile_image_url').value = data.profile_image_url || "";
}

// Helper: show session UI
function showSession(user) {
  document.getElementById('user-email').textContent = user.email;
  document.getElementById('session-panel').style.display = 'block';
  document.getElementById('profile-form').style.display = 'block';
  document.getElementById('auth-panel').style.display = 'none';
}
