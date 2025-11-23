console.clear();

const container = document.querySelector(".hero-container");
let heightRatio = window.innerWidth / window.innerHeight;
const tl = gsap
  .timeline({
    scrollTrigger: {
      trigger: ".hero-section",
      start: "top top",
      end: "+=200%",
      pin: true,
      scrub: true,
      invalidateOnRefresh: true
    }
  })
  .fromTo(
    [".hero-bg-svg", ".hero-content"],
    {
      autoAlpha: 0
    },
    {
      autoAlpha: 1
    }
  )
  .fromTo(
    logoPath,
    {
      scaleX: 0.25,
      scaleY: () => 0.25 * heightRatio,
      x: 0,
      transformOrigin: "center center"
    },
    {
      scaleX: 21,
      scaleY: () => 21 * heightRatio,
      x: -1.45,
      transformOrigin: "center center",
      duration: 1,
      ease: "power2.in"
    }
  )
  .to({}, { duration: 0.25 });
const boxes = gsap.utils.toArray(".box");
gsap
  .timeline({
    scrollTrigger: {
      trigger: ".panel.green",
      start: "top 20%",
      end: "center 20%",
      scrub: true
    }
  })
  .to(boxes, {
    x: (i) => (i % 2 < 1 ? 100 : -100),
    rotation: (i) => (i % 2 < 1 ? 360 : -360),
    ease: "none"
  });

window.addEventListener("resize", () => {
  const { innerWidth, innerHeight } = window;
  heightRatio = innerWidth / innerHeight;
});
