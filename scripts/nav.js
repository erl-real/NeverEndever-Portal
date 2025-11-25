// /scripts/nav.js

const NAV_CONFIG = {
  public: [
    { label: "Home", icon: "fa-home", href: "index.html" },
    { label: "ELO Rankings", icon: "fa-trophy", href: "pages/elo/index.html" },
    { label: "AI Protocol", icon: "fa-microchip", href: "pages/endeverai/index.html" },
    { label: "Community", icon: "fa-comments", href: "pages/messageboard/index.html" },
    { label: "Events", icon: "fa-calendar-alt", href: "pages/events/index.html" },
    { label: "About", icon: "fa-info-circle", href: "pages/about/index.html" },
    { label: "Contact", icon: "fa-envelope", href: "pages/contact/index.html" },
    { label: "Login", icon: "fa-sign-in-alt", href: "pages/login/index.html" }
  ],

  loggedIn: {
    artist: [
      { label: "Artist Dashboard", icon: "fa-user-astronaut", href: "pages/dashboard/index.html" },
      { label: "Tracks", icon: "fa-music", href: "pages/dashboard/tracks.html" },
      { label: "Analytics", icon: "fa-chart-bar", href: "pages/dashboard/analytics.html" },
      { label: "Settings", icon: "fa-cog", href: "pages/dashboard/settings.html" }
    ],
    staff: [
      { label: "Staff Dashboard", icon: "fa-briefcase", href: "pages/staff/index.html" },
      { label: "Moderation", icon: "fa-shield-alt", href: "pages/staff/moderation.html" },
      { label: "Reports", icon: "fa-file-alt", href: "pages/staff/reports.html" }
    ],
    admin: [
      { label: "Admin Panel", icon: "fa-tools", href: "pages/admin/index.html" },
      { label: "User Management", icon: "fa-users", href: "pages/admin/users.html" },
      { label: "System Settings", icon: "fa-cogs", href: "pages/admin/settings.html" },
      { label: "Reports", icon: "fa-file-alt", href: "pages/admin/reports.html" }
    ],
    shared: [
      { label: "Profile", icon: "fa-user", href: "pages/profile/index.html" },
      { label: "Community", icon: "fa-comments", href: "pages/messageboard/index.html" },
      { label: "Events", icon: "fa-calendar-alt", href: "pages/events/index.html" },
      { label: "Logout", icon: "fa-sign-out-alt", action: () => Auth.logout() }
    ]
  }
};

function renderSidebar(user) {
  const sidebar = document.getElementById("sidebar");
  sidebar.innerHTML = `
    <div class="sidebar-header">
      <div class="brand">
        <i class="fas fa-star"></i> <span>Endever Live</span>
      </div>
      <div class="sidebar-toggle-btn" onclick="App.toggleSidebar()">
        <i class="fas fa-chevron-left"></i>
      </div>
    </div>
  `;

  let navItems;
  if (!user) {
    // Visitor → public nav
    navItems = NAV_CONFIG.public;
  } else {
    // Logged-in → role-specific + shared
    const role = user.role;
    const roleItems = NAV_CONFIG.loggedIn[role] || []; // fallback empty if unknown
    const sharedItems = NAV_CONFIG.loggedIn.shared;
    navItems = roleItems.length ? [...roleItems, ...sharedItems] : NAV_CONFIG.public;
  }

  navItems.forEach(item => {
    const link = document.createElement("a");
    link.className = "nav-item";
    link.href = item.href || "#";
    link.innerHTML = `<i class="fas ${item.icon}"></i> <span>${item.label}</span>`;
    if (item.action) link.onclick = item.action;
    sidebar.appendChild(link);
  });

  // Highlight active page
  const currentPath = window.location.pathname;
  [...sidebar.querySelectorAll(".nav-item")].forEach(link => {
    if (link.href.includes(currentPath)) {
      link.classList.add("active");
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const userStr = localStorage.getItem("endever_user");
  const user = userStr ? JSON.parse(userStr) : null;
  renderSidebar(user);
});
