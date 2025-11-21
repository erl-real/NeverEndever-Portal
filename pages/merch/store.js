document.addEventListener("DOMContentLoaded", () => {
  const toggleBtn = document.getElementById("toggleSidebar");
  const sidebar = document.getElementById("sidebar");
  const burger = toggleBtn.querySelector(".burger-menu");

  // Toggle sidebar open/close
  toggleBtn.addEventListener("click", () => {
    sidebar.classList.toggle("collapsed");
    burger.classList.toggle("open");
  });

  // Glider effect: move highlight to checked radio
  const radios = sidebar.querySelectorAll("input[type=radio]");
  const glider = sidebar.querySelector(".glider");

  function updateGlider() {
    const checked = sidebar.querySelector("input[type=radio]:checked + label");
    if (checked) {
      const rect = checked.getBoundingClientRect();
      const sidebarRect = sidebar.getBoundingClientRect();
      const offsetTop = rect.top - sidebarRect.top;
      glider.style.transform = `translateY(${offsetTop}px)`;
      glider.style.height = `${rect.height}px`;
      glider.style.opacity = 1;
    }
  }

  radios.forEach(radio => {
    radio.addEventListener("change", updateGlider);
  });

  // Initialize glider on load
  updateGlider();

  // Optional: smooth scroll for internal links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", e => {
      e.preventDefault();
      const target = document.querySelector(anchor.getAttribute("href"));
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
      }
    });
  });
});
