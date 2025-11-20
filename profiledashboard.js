/* === Profile Dashboard JS === */

const ProfileDashboard = {
  currentTab: "overview",

  init() {
    this.bindMenu();
    this.switchTab(this.currentTab);
  },

  bindMenu() {
    const items = document.querySelectorAll(".profiledashboard-menu-item");
    items.forEach(item => {
      item.addEventListener("click", () => {
        items.forEach(i => i.classList.remove("active"));
        item.classList.add("active");
        const tab = item.dataset.tab;
        this.switchTab(tab);
      });
    });
  },

  switchTab(tabName) {
    this.currentTab = tabName;
    const sections = document.querySelectorAll(".profiledashboard-section");
    sections.forEach(sec => {
      sec.classList.add("hidden");
    });
    const active = document.getElementById(`tab-${tabName}`);
    if (active) active.classList.remove("hidden");
  },

  close() {
    const modal = document.getElementById("profiledashboard");
    if (modal) {
      modal.style.display = "none";
    }
  },

  // Example: update preview iframe src dynamically
  updatePreview(url) {
    const frame = document.getElementById("profilePreview");
    if (frame) frame.src = url;
  }
};

/* === Boot === */
document.addEventListener("DOMContentLoaded", () => {
  ProfileDashboard.init();
});
