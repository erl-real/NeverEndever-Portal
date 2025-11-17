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

// Initialize Supabase client (make sure @supabase/supabase-js is loaded)
const supabaseClient = supabase.createClient(
  "https://imqfnxtornlvglwvkspi.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImltcWZueHRvcm5sdmdsd3Zrc3BpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMxMzQyNjksImV4cCI6MjA3ODcxMDI2OX0.Is7G7NCKxTQDoefyitkfhREXAR8m8cBBTjohRiBKMs4"
);

// Load profile on dashboard
async function loadProfile() {
  console.log("loadProfile running...");
  const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
  if (userError) console.error("Auth error:", userError.message);

  if (!user) {
    console.warn("No user found, redirecting to login.");
    window.location.href = "login.html";
    return;
  }

  // Artist info
  document.getElementById("username").textContent = user.user_metadata?.username || "Anonymous";
  document.getElementById("email").textContent = user.email;
  document.getElementById("avatar").src = user.user_metadata?.avatar_url || "https://via.placeholder.com/120";

  // Load profile data from DB
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
  }

  // Load uploads
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

  // Load member extras
  const { data: member, error: memberError } = await supabaseClient
    .from("members")
    .select("*")
    .eq("id", user.id)
    .single();

  if (memberError) console.error("Member error:", memberError.message);
  if (member && member.donate_url) {
    const donateLink = document.getElementById("donate-link");
    donateLink.href = member.donate_url;
    donateLink.textContent = "Donate";
  }

  // Role check
  const role = user.user_metadata?.role || "artist";
  if (role === "staff") {
    document.getElementById("staff-tools").style.display = "block";
    loadStaffTools();
  }
}

// Uploads form
document.getElementById("upload-form")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const { data: { user } } = await supabaseClient.auth.getUser();
  const title = document.getElementById("song-title").value;
  const link = document.getElementById("song-link").value;

  const { error } = await supabaseClient.from("uploads").insert({
    user_id: user.id,
    title,
    url: link
  });

  if (error) {
    console.error("Upload insert error:", error.message);
    alert("Error saving upload: " + error.message);
  } else {
    alert("Upload saved!");
    loadProfile(); // refresh list
  }
});

// Profile edit form
document.getElementById("profile-edit-form")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const { data: { user } } = await supabaseClient.auth.getUser();

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
    updated_at: new Date()
  };

  const { error } = await supabaseClient.from("profiles").upsert(updates);
  if (error) {
    console.error("Profile upsert error:", error.message);
    alert("Error saving profile: " + error.message);
  } else {
    alert("Profile saved!");
  }
});

// Member extras: donate link
document.getElementById("save-donate")?.addEventListener("click", async () => {
  const { data: { user } } = await supabaseClient.auth.getUser();
  const donateUrl = document.getElementById("donate-url").value;

  const { error } = await supabaseClient.from("members").upsert({
    id: user.id,
    donate_url: donateUrl
  });

  if (error) {
    console.error("Member upsert error:", error.message);
    alert("Error saving donate link: " + error.message);
  } else {
    const donateLink = document.getElementById("donate-link");
    donateLink.href = donateUrl;
    donateLink.textContent = "Donate";
    alert("Donate link saved!");
  }
});

// Staff tools
async function loadStaffTools() {
  const { count, error } = await supabaseClient
    .from("uploads")
    .select("*", { count: "exact", head: true });

  if (error) console.error("Upload count error:", error.message);
  document.getElementById("total-uploads").textContent = count || "0";

  const { count: profileCount, error: profileError } = await supabaseClient
    .from("profiles")
    .select("*", { count: "exact", head: true });

  if (profileError) console.error("Profile count error:", profileError.message);
  document.getElementById("total-users").textContent = profileCount || "0";
}

// Logout
document.getElementById("logout")?.addEventListener("click", async () => {
  await supabaseClient.auth.signOut();
  window.location.href = "index.html";
});

// Run on page load
if (document.querySelector(".dashboard")) {
  loadProfile();
}

// Handle sample form submission
async function handleFormSubmit(event) {
  event.preventDefault();
  const
