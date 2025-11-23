document.addEventListener("DOMContentLoaded", () => {
  const toggleBtn = document.getElementById("toggleSidebar");
  const sidebar = document.getElementById("sidebar");
  const burger = toggleBtn?.querySelector(".burger-menu");

  if (toggleBtn && sidebar && burger) {
    toggleBtn.addEventListener("click", () => {
      sidebar.classList.toggle("collapsed");
      burger.classList.toggle("open");
    });
  }
});


  // Glider hover tracking
  const glider = document.querySelector(".glider");
  const labels = document.querySelectorAll(".radio-nav-container label");

  function moveGliderTo(label) {
    if (!glider || !label) return;
    const offsetTop = label.offsetTop;
    const height = label.offsetHeight;
    glider.style.transform = `translateY(${offsetTop}px)`;
    glider.style.height = `${height}px`;
  }

  labels.forEach(label => {
    label.addEventListener("mouseenter", () => {
      moveGliderTo(label);
      glider.style.opacity = "1";
    });
  });

  const navContainer = document.querySelector(".radio-nav-container");
  if (navContainer && glider) {
    navContainer.addEventListener("mouseleave", () => {
      glider.style.opacity = "0";
    });
  }

  // ✅ Persistence: save checked radio to localStorage
  const radios = document.querySelectorAll(".radio-nav-container input");
  radios.forEach(radio => {
    radio.addEventListener("change", () => {
      localStorage.setItem("activeNav", radio.id);
    });
  });

  // ✅ Restore last active radio on load
  const savedId = localStorage.getItem("activeNav");
  if (savedId) {
    const savedRadio = document.getElementById(savedId);
    if (savedRadio) savedRadio.checked = true;
  }

  // Keep glider hidden initially
  if (glider) glider.style.opacity = "0";

});
