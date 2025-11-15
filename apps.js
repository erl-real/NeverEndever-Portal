async function emailLogin() {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    document.getElementById('error').textContent = error.message;
  } else {
    document.getElementById('user-email').textContent = data.user.email;
    document.getElementById('session-panel').style.display = 'block';
    document.getElementById('profile-form').style.display = 'block';
  }
}

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

async function logout() {
  await supabase.auth.signOut();
  document.getElementById('session-panel').style.display = 'none';
  document.getElementById('profile-form').style.display = 'none';
}

async function saveProfile() {
  const username = document.getElementById('username').value;
  const bio = document.getElementById('bio').value;

  const user = (await supabase.auth.getUser()).data.user;

  const { error } = await supabase.from('profiles').upsert({
    id: user.id,
    username,
    bio
  });

  if (error) {
    document.getElementById('error').textContent = error.message;
  } else {
    document.getElementById('status').textContent = "Profile saved!";
  }
}
