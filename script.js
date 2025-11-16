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
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImltcWZueHRvcm5sdmdsd3Zrc3BpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMxMzQyNjksImV4cCI6MjA3ODcxMDI2OX0.Is7G7NCKxTQDoefyitkfhREXAR8m8cBBTjohRiBKMs4" // replace with your anon key
);

// Login
document.getElementById('login-form')?.addEventListener('submit', async (e) => {
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

    window.location.href = role === "staff" ? "dashboard.html" : "dashboard.html";
    // staff tools are inside dashboard.html now, no separate file needed
  }
});

// Signup
document.getElementById('signup-form')?.addEventListener('submit', async (e) => {
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

// Load profile on dashboard
async function loadProfile() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    window.location.href = "login.html";
    return;
  }

  // Artist info
  document.getElementById("username").textContent = user.user_metadata?.username || "Anonymous";
  document.getElementById("email").textContent = user.email;
  document.getElementById("avatar").src = user.user_metadata?.avatar_url || "https://via.placeholder.com/120";

  // Role check
  const role = user.user_metadata?.role || "artist";
  if (role === "staff") {
    document.getElementById("staff-tools").style.display = "block";
    loadStaffTools();
  }
}

// Uploads form
document.getElementById("upload-form")?.addEventListener("submit", (e) => {
  e.preventDefault();
  const title = document.getElementById("song-title").value;
  const link = document.getElementById("song-link").value;

  const list = document.getElementById("uploads-list");
  const li = document.createElement("li");
  const a = document.createElement("a");
  a.href = link;
  a.textContent = title;
  a.target = "_blank";
  li.appendChild(a);
  list.appendChild(li);

  // TODO: Save to Supabase table later
});

// Profile edit form
document.getElementById("profile-edit-form")?.addEventListener("submit", (e) => {
  e.preventDefault();

  const bio = document.getElementById("bio").value;
  const brandColor = document.getElementById("brand-color").value;
  const twitter = document.getElementById("twitter").value;
  const instagram = document.getElementById("instagram").value;
  const soundcloud = document.getElementById("soundcloud").value;
  const embed1 = document.getElementById("embed1").value;
  const embed2 = document.getElementById("embed2").value;
  const embed3 = document.getElementById("embed3").value;

  alert("Profile saved! (Later we’ll store this in Supabase)");
});

// Member extras: donate link
document.getElementById("save-donate")?.addEventListener("click", () => {
  const donateUrl = document.getElementById("donate-url").value;
  const donateLink = document.getElementById("donate-link");
  donateLink.href = donateUrl;
  donateLink.textContent = "Donate";
});

// Staff tools
async function loadStaffTools() {
  // Example stats placeholders
  document.getElementById("total-users").textContent = "42"; // replace with Supabase query later
  document.getElementById("total-uploads").textContent = "17"; // replace with Supabase query later
}

// Logout
document.getElementById("logout")?.addEventListener("click", async () => {
  await supabase.auth.signOut();
  window.location.href = "index.html";
});

// Run on page load
if (document.querySelector(".dashboard")) {
  loadProfile();
}
