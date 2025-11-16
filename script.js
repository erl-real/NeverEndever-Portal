// Dropdown toggle
document.querySelectorAll('.dropbtn').forEach(button => {
  button.addEventListener('click', () => {
    const dropdown = button.nextElementSibling;

    // Close other dropdowns
    document.querySelectorAll('.dropdown-content').forEach(menu => {
      if (menu !== dropdown) menu.style.display = 'none';
    });

    // Toggle current dropdown
    dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
  });
});

// Close dropdowns if clicking outside
window.addEventListener('click', (e) => {
  if (!e.target.matches('.dropbtn')) {
    document.querySelectorAll('.dropdown-content').forEach(menu => {
      menu.style.display = 'none';
    });
  }
});

// Initialize Supabase client
const supabase = supabase.createClient(
  "https://imqfnxtornlvglwvkspi.supabase.co",
  "YOUR-ANON-KEY-HERE" // replace with your anon key
);

// Login
document.getElementById('login-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    alert("Login failed: " + error.message);
  } else {
    alert("Logged in successfully!");

    // Check role metadata
    const { data: { user } } = await supabase.auth.getUser();
    const role = user?.user_metadata?.role || "artist"; // default to artist

    if (role === "staff") {
      window.location.href = "staff-dashboard.html";
    } else {
      window.location.href = "dashboard.html";
    }
  }
});

// Signup
document.getElementById('signup-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('signup-email').value;
  const password = document.getElementById('signup-password').value;

  // Default signup assigns "artist" role
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { role: "artist" } // metadata field
    }
  });

  if (error) {
    alert("Signup failed: " + error.message);
  } else {
    alert("Signup successful! Please check your email for confirmation.");
  }
});
