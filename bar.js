// bar.js
(function () {
  let initialized = false;

  function initNav() {
    if (initialized) return;

    const body   = document.body;
    const menu   = document.querySelector('.menu');
    const burger = document.querySelector('.burger-container');

    if (!menu || !burger) return; // nav not injected yet

    // Hamburger toggle
    burger.addEventListener('click', (e) => {
      e.stopPropagation();
      burger.classList.toggle('open');       // buns -> X
      body.classList.toggle('openNav');      // slide sidebar

      // Reset submenus when collapsing
      if (!body.classList.contains('openNav')) {
        menu.querySelectorAll('li.open').forEach(li => li.classList.remove('open'));
      }
    });

    // Dropdowns via event delegation
    menu.addEventListener('click', (e) => {
      const link   = e.target.closest('a');
      const li     = link && link.closest('li');
      const flyout = li && li.querySelector('.nav-flyout');
      if (!link || !flyout) return;

      e.preventDefault();
      e.stopPropagation();

      // Close other open submenus
      menu.querySelectorAll('li.open').forEach(other => {
        if (other !== li) other.classList.remove('open');
      });

      // Toggle this submenu
      li.classList.toggle('open');
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!body.classList.contains('openNav')) return;
      const insideMenu   = menu.contains(e.target);
      const insideBurger = burger.contains(e.target);
      if (!insideMenu && !insideBurger) {
        body.classList.remove('openNav');
        burger.classList.remove('open');
        menu.querySelectorAll('li.open').forEach(li => li.classList.remove('open'));
      }
    });

    initialized = true;
  }

  // Run init when DOM is ready
  document.addEventListener('DOMContentLoaded', initNav);

  // Also detect when nav.html is injected and then initialize
  const observer = new MutationObserver(() => {
    const menu   = document.querySelector('.menu');
    const burger = document.querySelector('.burger-container');
    if (menu && burger) {
      initNav();
      observer.disconnect(); // stop watching once initialized
    }
  });
  observer.observe(document.documentElement, { childList: true, subtree: true });
})();
