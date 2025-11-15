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

// Save profile data
async function saveProfile() {
  const username = document.getElementById('username').value;
  const bio = document.getElementById('bio').value;
  const genre = document.getElementById('genre')?.value || null;
  const instagram = document.getElementById('instagram')?.value || null;
  const soundcloud = document.getElementById('soundcloud')?.value || null;
  const profile_image_url = document.getElementById('profile_image_url')?.value || null;

  const user = (await supabase.auth.getUser()).data.user;

  const { error } = await supabase.from('profiles').upsert({
    id: user.id,
    username,
    bio,
    genre,
    instagram,
    soundcloud,
    profile_image_url
  });

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
