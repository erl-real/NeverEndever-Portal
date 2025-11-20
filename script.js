
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


import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

// Initialize Supabase client
const supabaseClient = createClient(
  "https://imqfnxtornlvglwvkspi.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImltcWZueHRvcm5sdmdsd3Zrc3BpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMxMzQyNjksImV4cCI6MjA3ODcxMDI2OX0.Is7G7NCKxTQDoefyitkfhREXAR8m8cBBTjohRiBKMs4"
);


// Helpers
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const strongPwRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&]).{8,}$/;
const disposableDomains = ["mailinator.com", "10minutemail.com", "tempmail.com"];

const setStatus = (msg, mode) => {
  const el = document.getElementById(
    mode === "login" ? "auth-status-login" : "auth-status-signup"
  );
  if (el) el.textContent = msg || "";
};

const Auth = {
  switch: (mode) => {
    document.getElementById("tab-login").classList.toggle("active", mode === "login");
    document.getElementById("tab-signup").classList.toggle("active", mode === "signup");
    document.getElementById("form-login").classList.toggle("hidden", mode !== "login");
    document.getElementById("form-signup").classList.toggle("hidden", mode !== "signup");
    setStatus("", mode);
  },

  handleLogin: async () => {
    const email = document.getElementById("login-user").value.trim();
    const password = document.getElementById("login-pass").value;

    if (!emailRegex.test(email)) return setStatus("Please enter a valid email.", "login");
    if (password.length < 8) return setStatus("Password must be at least 8 characters.", "login");

    const { error } = await supabaseClient.auth.signInWithPassword({ email, password });
    if (error) return setStatus("Login failed: " + error.message, "login");

    setStatus("Login successful!", "login");
    Auth.close();
    window.location.href = "dashboard.html";
  },

  handleSignup: async () => {
    const email = document.getElementById("sign-user").value.trim();
    const password = document.getElementById("sign-pass").value;

    if (!emailRegex.test(email)) return setStatus("Invalid email format.", "signup");

    const domain = email.split("@")[1]?.toLowerCase();
    if (disposableDomains.includes(domain)) {
      return setStatus("Disposable email addresses are not allowed.", "signup");
    }

    if (!strongPwRegex.test(password)) {
      return setStatus("Use 8+ chars with upper/lowercase, number, and special char.", "signup");
    }

    const { error } = await supabaseClient.auth.signUp({ email, password });
    if (error) return setStatus("Signup failed: " + error.message, "signup");

    setStatus("Signup successful! Check your email to confirm.", "signup");
    Auth.close();
  },

  close: () => {
    document.getElementById("auth-overlay").classList.remove("open");
  },

  logout: async () => {
    const { error } = await supabaseClient.auth.signOut();
    if (error) {
      setStatus("Logout failed: " + error.message, "login");
    } else {
      setStatus("Logged out successfully.", "login");
      document.getElementById("dash-overlay").classList.remove("open");
      document.getElementById("auth-overlay").classList.add("open");
    }
  }
};

window.Auth = Auth;

// Optional: listen for auth state changes
supabaseClient.auth.onAuthStateChange((event, session) => {
  console.log("Auth event:", event);
  console.log("Session:", session);
});

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
function setupFibonacciSpiral() {
    const c = document.getElementById("anim9");
    if (!c) return;
    c.innerHTML = "";
    const wrap = document.createElement("div");
    wrap.className = "fibonacci-container";
    c.appendChild(wrap);
    const cd = document.createElement("div");
    cd.className = "dot";
    cd.style.width = cd.style.height = "6px";
    cd.style.left = "calc(50% - 3px)";
    cd.style.top = "calc(50% - 3px)";
    cd.style.background = "rgba(255,255,255,0.9)";
    wrap.appendChild(cd);
    const golden = Math.PI * (3 - Math.sqrt(5)),
      N = 100,
      scale = 0.8;
    for (let i = 0; i < N; i++) {
      const angle = i * golden,
        rad = scale * Math.sqrt(i) * 4;
      const x = Math.cos(angle) * rad,
        y = Math.sin(angle) * rad;
      const sz = 3 - (i / N) * 1.5;
      if (sz < 1) continue;
      const d = document.createElement("div");
      d.className = "fibonacci-dot";
      d.style.width = d.style.height = `${sz}px`;
      d.style.left = `calc(50% + ${x}px - ${sz / 2}px)`;
      d.style.top = `calc(50% + ${y}px - ${sz / 2}px)`;
      d.style.animationDelay = `${(i / N) * 3}s`;
      d.style.background = `rgba(255,255,255,${(90 - (i / N) * 60) / 100})`;
      wrap.appendChild(d);
    }
  }

  function setupHalftoneGradient() {
    const c = document.getElementById("anim10");
    if (!c) return;
    c.innerHTML = "";
    const w = document.createElement("div");
    w.className = "halftone-container";
    c.appendChild(w);
    const radii = [20, 40, 60, 80];
    radii.forEach((radius, i) => {
      const count = 12 + i * 8,
        size = 6 - i;
      for (let j = 0; j < count; j++) {
        const d = document.createElement("div");
        d.className = "halftone-dot";
        d.style.width = d.style.height = `${size}px`;
        const angle = (j / count) * 2 * Math.PI;
        const x = Math.cos(angle) * radius,
          y = Math.sin(angle) * radius;
        d.style.left = `calc(50% + ${x}px - ${size / 2}px)`;
        d.style.top = `calc(50% + ${y}px - ${size / 2}px)`;
        d.style.animationDelay = `${(i * 0.3 + j / count).toFixed(2)}s`;
        d.style.background = `rgba(255,255,255,${(90 - i * 15) / 100})`;
        w.appendChild(d);
      }
    });
  }

  function setupSilverSpiral() {
    const c = document.getElementById("anim11");
    if (!c) return;
    c.innerHTML = "";
    const w = document.createElement("div");
    w.className = "silver-container";
    c.appendChild(w);
    const N = 120,
      angleStep = Math.PI * (2 - Math.sqrt(2)),
      scale = 1.2;
    for (let i = 0; i < N; i++) {
      const angle = i * angleStep,
        rad = scale * Math.sqrt(i) * 6;
      const size = 4 - (i / N) * 2;
      if (size < 1) continue;
      const d = document.createElement("div");
      d.className = "silver-dot";
      d.style.width = d.style.height = `${size}px`;
      d.style.left = `calc(50% + ${Math.cos(angle) * rad}px - ${size / 2}px)`;
      d.style.top = `calc(50% + ${Math.sin(angle) * rad}px - ${size / 2}px)`;
      d.style.animationDelay = `${(i / N) * 2}s`;
      w.appendChild(d);
    }
  }

  // 12. Sunflower Spiral (perfect SVG + SMIL)
  function setupFibonacciConcentric() {
    const c = document.getElementById("anim12");
    if (!c) return;
    c.innerHTML = "";
    const N = 200;
    const SIZE = 180;
    const DOT_RADIUS = 2;
    const MARGIN = 4;
    const CENTER = SIZE / 2;
    const MAX_RADIUS = CENTER - MARGIN - DOT_RADIUS;
    const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5));
    const DURATION = 3;
    const svgNS = "http://www.w3.org/2000/svg";

    const svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("width", SIZE);
    svg.setAttribute("height", SIZE);
    svg.setAttribute("viewBox", `0 0 ${SIZE} ${SIZE}`);
    c.appendChild(svg);

    for (let i = 0; i < N; i++) {
      const idx = i + 0.5;
      const frac = idx / N;
      const r = Math.sqrt(frac) * MAX_RADIUS;
      const theta = idx * GOLDEN_ANGLE;
      const x = CENTER + r * Math.cos(theta);
      const y = CENTER + r * Math.sin(theta);

      const circle = document.createElementNS(svgNS, "circle");
      circle.setAttribute("cx", x);
      circle.setAttribute("cy", y);
      circle.setAttribute("r", DOT_RADIUS);
      circle.setAttribute("fill", "#fff");
      circle.setAttribute("opacity", "0.6");
      svg.appendChild(circle);

      // radius pulse
      const animR = document.createElementNS(svgNS, "animate");
      animR.setAttribute("attributeName", "r");
      animR.setAttribute(
        "values",
        `${DOT_RADIUS * 0.5};${DOT_RADIUS * 1.5};${DOT_RADIUS * 0.5}`
      );
      animR.setAttribute("dur", `${DURATION}s`);
      animR.setAttribute("begin", `${frac * DURATION}s`);
      animR.setAttribute("repeatCount", "indefinite");
      animR.setAttribute("calcMode", "spline");
      animR.setAttribute("keySplines", "0.4 0 0.6 1;0.4 0 0.6 1");
      circle.appendChild(animR);

      // opacity pulse
      const animO = document.createElementNS(svgNS, "animate");
      animO.setAttribute("attributeName", "opacity");
      animO.setAttribute("values", "0.3;1;0.3");
      animO.setAttribute("dur", `${DURATION}s`);
      animO.setAttribute("begin", `${frac * DURATION}s`);
      animO.setAttribute("repeatCount", "indefinite");
      animO.setAttribute("calcMode", "spline");
      animO.setAttribute("keySplines", "0.4 0 0.6 1;0.4 0 0.6 1");
      circle.appendChild(animO);
    }
  }

  // Add corner decorations to all animation containers
  function addCornerDecorations() {
    document.querySelectorAll(".animation-container").forEach((container) => {
      // Create corner SVG elements
      const corners = ["top-left", "top-right", "bottom-left", "bottom-right"];

      corners.forEach((position) => {
        const corner = document.createElement("div");
        corner.className = `corner ${position}`;

        // Use the plus symbol SVG
        const svg = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "svg"
        );
        svg.setAttribute("width", "16");
        svg.setAttribute("height", "16");
        svg.setAttribute("viewBox", "0 0 512 512");
        svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");

        // Create plus symbol polygon
        const polygon = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "polygon"
        );
        polygon.setAttribute(
          "points",
          "448,224 288,224 288,64 224,64 224,224 64,224 64,288 224,288 224,448 288,448 288,288 448,288"
        );
        polygon.setAttribute("fill", "currentColor");

        svg.appendChild(polygon);
        corner.appendChild(svg);
        container.appendChild(corner);
      });
    });
  }


