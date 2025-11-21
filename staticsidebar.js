const radios = document.querySelectorAll('.radio-nav-container input');
const glider = document.querySelector('.glider');

radios.forEach(radio => {
  radio.addEventListener('change', () => {
    const label = radio.nextElementSibling;
    if (label) {
      const offsetTop = label.offsetTop;
      glider.style.transform = `translateY(${offsetTop}px)`;
      glider.style.height = `${label.offsetHeight}px`; // match label height
    }
  });
});

// Initialize on page load
document.querySelector('.radio-nav-container input:checked')?.dispatchEvent(new Event('change'));
// staticnavbar.js
document.addEventListener("DOMContentLoaded", () => {
  fetch("nav.html")
    .then(response => response.text())
    .then(data => {
      document.getElementById("nav").innerHTML = data;
    });
});
