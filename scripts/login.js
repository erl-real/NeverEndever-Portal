var element = document.getElementById("app");

function openLogin() {
  element.classList.remove("openRegister");
  element.classList.add("openLogin");
}

function openRegister() {
  element.classList.remove("openLogin");
  element.classList.add("openRegister");
}

function openStartL() {
  element.classList.add("openStart");
  let input = document.getElementById('username');
  document.getElementById('usernameValue').textContent = input.value;
}

function openStartR() {
  element.classList.add("openStart");
  let input = document.getElementById('rusername');
  document.getElementById('usernameValue').textContent = input.value;
}

function restart() {
  element.classList.remove("openStart");
}

var mySwiper = new Swiper('.swiper-container', {
  loop: true,
  effect: 'coverflow',
  grabCursor: true,
  mousewheel: true,
  centeredSlides: true,
  slidesPerView: 'auto',
  coverflowEffect: {
    rotate: 0,
    stretch: 90,
    depth: 10,
    modifier: 1,
    slideShadows: true,
  },

  // If we need pagination
  pagination: {
    el: '.swiper-pagination',
        dynamicBullets: true,
  },

})
