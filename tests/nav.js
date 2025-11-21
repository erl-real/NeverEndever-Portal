document.addEventListener('DOMContentLoaded', () => {
  const burger = document.querySelector('.burger-container');
  const body = document.body;

  // Toggle hamburger open/close
  burger.addEventListener('click', () => {
    burger.classList.toggle('open');
    body.classList.toggle('openNav');
  });

  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (
      body.classList.contains('openNav') &&
      !e.target.closest('.menu') &&
      !e.target.closest('.burger-container')
    ) {
      body.classList.remove('openNav');
      burger.classList.remove('open');
    }
  });

  // Load nav links from nav.html
  fetch('nav.html')
    .then(res => res.text())
    .then(html => {
      document.getElementById('nav-placeholder').innerHTML = html;
    });

  // Skin switcher: static vs logged-in
  function applySkin() {
    if (body.classList.contains('logged-in')) {
      // Dashboard skin
      body.classList.add('dashboard-skin');
    } else {
      // Static page skin
      body.classList.remove('dashboard-skin');
    }
  }

  // Run once on load
  applySkin();

  // Optional: observe class changes to body
  const observer = new MutationObserver(applySkin);
  observer.observe(body, { attributes: true, attributeFilter: ['class'] });
});
