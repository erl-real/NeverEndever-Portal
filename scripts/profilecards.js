const isTouch = "ontouchstart" in window;

document.querySelectorAll(".card").forEach((card) => {
  const inner = card.querySelector(".card-inner");

  // Tap/click flip met subtiele scale-bounce
  card.addEventListener("click", () => {
    const baseRotate = card.classList.contains("flipped") ? 0 : 180;

    inner.style.transition = "transform 0.15s ease-out";
    inner.style.transform = `rotateY(${baseRotate}deg) scale(1.05)`;

    setTimeout(() => {
      inner.style.transition = "transform 0.7s cubic-bezier(.4,.2,.2,1)";
      inner.style.transform = `rotateY(${baseRotate}deg) scale(1)`;
      card.classList.toggle("flipped");
    }, 150);
  });

  if (!isTouch) {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -10;
      const rotateY = ((x - centerX) / centerX) * 10;
      const baseRotate = card.classList.contains("flipped") ? 180 : 0;
      inner.style.transform = `rotateY(${baseRotate}deg) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1)`;
    });

    card.addEventListener("mouseleave", () => {
      const baseRotate = card.classList.contains("flipped") ? 180 : 0;
      inner.style.transform = `rotateY(${baseRotate}deg) rotateX(0deg) rotateY(0deg) scale(1)`;
    });
  }
});
