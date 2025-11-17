// Dropdown toggle
document.querySelectorAll('.dropbtn').forEach(button => {
  button.addEventListener('click', () => {
    const dropdown = button.nextElementSibling;
    document.querySelectorAll('.dropdown-content').forEach(menu => {
      if (menu !== dropdown) menu.style.display = 'none';
    });
    dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
  });
});

window.addEventListener('click', (e) => {
  if (!e.target.matches('.dropbtn')) {
    document.querySelectorAll('.dropdown-content').forEach(menu => {
      menu.style.display = 'none';
    });
  }
});

// Initialize Supabase client (make sure @supabase/supabase-js is loaded in index.html)
const supabaseClient = supabase.createClient(
  "https://imqfnxtornlvglwvkspi.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImltcWZueHRvcm5sdmdsd3Zrc3BpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMxMzQyNjksImV4cCI6MjA3ODcxMDI2OX0.Is7G7NCKxTQDoefyitkfhREXAR8m8cBBTjohRiBKMs4"
);

// -------------------- LOGIN --------------------
document.getElementById("login-form")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;

  const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password });
  if (error) {
    alert("Login failed: " + error.message);
  } else {
    window.location.href = "dashboard.html";
  }
});

// -------------------- SIGNUP --------------------
document.getElementById("signup-form")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("signup-email").value;
  const password = document.getElementById("signup-password").value;

  const { data, error } = await supabaseClient.auth.signUp({ email, password });
  if (error) {
    alert("Signup failed: " + error.message);
  } else {
    alert("Signup successful! Check your email for confirmation.");
  }
});

// -------------------- AUTH STATE --------------------
supabaseClient.auth.onAuthStateChange((event, session) => {
  console.log("Auth event:", event);
  console.log("Session:", session);
});

// -------------------- SESSION CHECK --------------------
async function getCurrentSession() {
  const { data: { session }, error } = await supabaseClient.auth.getSession();
  if (error) console.error("Session error:", error.message);
  return session;
}

// -------------------- DASHBOARD --------------------
async function loadProfile() {
  const session = await getCurrentSession();
  const user = session?.user;
  if (!user) {
    window.location.href = "login.html";
    return;
  }

  // Artist info
  document.getElementById("username").textContent = user.user_metadata?.username || "Anonymous";
  document.getElementById("email").textContent = user.email;
  document.getElementById("avatar").src = user.user_metadata?.avatar_url || "https://via.placeholder.com/120";

  // Profile data
  const { data: profile, error: profileError } = await supabaseClient
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (profileError) console.error("Profile error:", profileError.message);
  if (profile) {
    document.getElementById("bio").value = profile.bio || "";
    document.getElementById("brand-color").value = profile.brand_color || "#b16eff";
    document.getElementById("twitter").value = profile.twitter_url || "";
    document.getElementById("instagram").value = profile.instagram_url || "";
    document.getElementById("soundcloud").value = profile.soundcloud_url || "";
    document.getElementById("embed1").value = profile.embed1 || "";
    document.getElementById("embed2").value = profile.embed2 || "";
    document.getElementById("embed3").value = profile.embed3 || "";
    if (profile.donate_url) {
      const donateLink = document.getElementById("donate-link");
      donateLink.href = profile.donate_url;
      donateLink.textContent = "Donate";
    }
  }

  // Uploads
  const { data: uploads, error: uploadsError } = await supabaseClient
    .from("uploads")
    .select("*")
    .eq("user_id", user.id);

  if (uploadsError) console.error("Uploads error:", uploadsError.message);

  const list = document.getElementById("uploads-list");
  list.innerHTML = "";
  if (uploads && uploads.length > 0) {
    uploads.forEach(file => {
      const li = document.createElement("li");
      const a = document.createElement("a");
      a.href = file.url;
      a.textContent = file.title;
      a.target = "_blank";
      li.appendChild(a);
      list.appendChild(li);
    });
  } else {
    list.innerHTML = "<li>No uploads yet.</li>";
  }

  // Role check
  const role = user.user_metadata?.role || "artist";
  if (role === "staff") {
    document.getElementById("staff-tools").style.display = "block";
    loadStaffTools();
  }
}

// -------------------- UPLOADS --------------------
document.getElementById("upload-form")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const session = await getCurrentSession();
  const user = session?.user;
  const title = document.getElementById("song-title").value;
  const link = document.getElementById("song-link").value;

  const { error } = await supabaseClient.from("uploads").insert({
    user_id: user.id,
    title,
    url: link
  });

  if (error) {
    alert("Error saving upload: " + error.message);
  } else {
    alert("Upload saved!");
    loadProfile();
  }
});

// -------------------- PROFILE EDIT --------------------
document.getElementById("profile-edit-form")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const session = await getCurrentSession();
  const user = session?.user;

  const updates = {
    id: user.id,
    bio: document.getElementById("bio").value,
    brand_color: document.getElementById("brand-color").value,
    twitter_url: document.getElementById("twitter").value,
    instagram_url: document.getElementById("instagram").value,
    soundcloud_url: document.getElementById("soundcloud").value,
    embed1: document.getElementById("embed1").value,
    embed2: document.getElementById("embed2").value,
    embed3: document.getElementById("embed3").value,
    donate_url: document.getElementById("donate-url")?.value || "",
    updated_at: new Date().toISOString()
  };

  const { error } = await supabaseClient.from("profiles").upsert(updates);
  if (error) {
    alert("Error saving profile: " + error.message);
  } else {
    alert("Profile saved!");
  }
});

// -------------------- STAFF TOOLS --------------------
async function loadStaffTools() {
  const { count } = await supabaseClient
    .from("uploads")
    .select("*", { count: "exact", head: true });
  document.getElementById("total-uploads").textContent = count || "0";

  const { count: profileCount } = await supabaseClient
    .from("profiles")
    .select("*", { count: "exact", head: true });
  document.getElementById("total-users").textContent = profileCount || "0";
}

// -------------------- LOGOUT --------------------
document.getElementById("logout")?.addEventListener("click", async () => {
  await supabaseClient.auth.signOut();
  window.location.href = "index.html";
});

// -------------------- INIT --------------------
document.addEventListener("DOMContentLoaded", () => {
  if (document.querySelector(".dashboard")) {
    loadProfile();
  }
});


