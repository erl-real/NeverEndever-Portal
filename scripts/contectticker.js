let tickerFn; // Store GSAP ticker callback for cleanup

function initSlider() {
  const slider = document.querySelector('#slider');

  // Grab original slider items (direct children)
  const originalItems = Array.from(slider.children);

  // Clear slider and add original items back (reset)
  slider.innerHTML = '';
  originalItems.forEach(item => slider.appendChild(item));

  // Calculate width of one slider item + margin right for spacing
  const itemStyle = getComputedStyle(originalItems[0]);
  const itemWidth = originalItems[0].offsetWidth + parseFloat(itemStyle.marginRight);

  // Total width of one full set of slides
  const fullSetWidth = originalItems.length * itemWidth;

  // Clone original items several times for infinite loop effect
  const cloneCount = 4; // Number of clones sets
  for (let i = 0; i < cloneCount; i++) {
    originalItems.forEach(item => {
      const clone = item.cloneNode(true);
      slider.appendChild(clone);
    });
  }

  // GSAP quickSetter for performant x position animation
  const setX = gsap.quickSetter(slider, "x", "px");

  let target = 0;   // Target scroll position (updated by wheel)
  let current = 0;  // Current animated scroll position

  // Linear interpolation helper for smooth easing
  const lerp = (a, b, n) => a + (b - a) * n;

  const sensitivity = 1;       // Wheel scroll sensitivity
  const easeFactor = 0.05;     // Smoothing factor for easing
  const autoScrollSpeed = 0.5; // Auto-scroll speed when idle

  let lastInteractionTime = Date.now(); // Last time wheel was used

  setX(0); // Start slider position at 0

  // Listen to mouse wheel to update target scroll position horizontally
  window.addEventListener('wheel', (e) => {
    e.preventDefault(); // Prevent vertical scroll
    target += e.deltaY * sensitivity; // Update target based on vertical wheel delta
    lastInteractionTime = Date.now(); // Reset idle timer
  }, { passive: false });

  // Remove old ticker if exists
  if (tickerFn) gsap.ticker.remove(tickerFn);

  // GSAP ticker runs every frame (~60fps)
  tickerFn = () => {
    // If idle for >1.5 seconds, auto scroll forward slowly
    if (Date.now() - lastInteractionTime > 1500) {
      target += autoScrollSpeed;
    }

    // Smoothly interpolate current position toward target
    current = lerp(current, target, easeFactor);

    // Wrap scroll to create infinite loop effect
    let mod = current % fullSetWidth;
    if (mod < 0) mod += fullSetWidth;

    // Move slider to negative mod (scroll left)
    setX(-mod);
  };

  gsap.ticker.add(tickerFn);

  // Add scroll scaling effect on items (scale down on scroll)
  const sliderItems = document.querySelectorAll(".slider-item");
  let scrollTimeout;

  window.addEventListener("wheel", () => {
    // Shrink items immediately when scrolling
    gsap.to(sliderItems, { scale: 0.7, duration: 0.8, ease: "power2.out" });

    // Restore scale after 150ms of no wheel events
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      gsap.to(sliderItems, { scale: 1, duration: 0.8, ease: "power2.out" });
    }, 10);
  }, { passive: true });
}

// Initialize the slider after page loads
window.addEventListener('load', initSlider);
