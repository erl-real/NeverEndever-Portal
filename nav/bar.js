$('.nav-toggle').click(function(e) {
  
  e.preventDefault();
  $("html").toggleClass("openNav");
  $(".nav-toggle").toggleClass("active");

  // Find the text-morph animation container
  const animContainer = document.querySelector('.animation-container .text-morph');
  if (animContainer) {
    const isActive = animContainer.classList.contains('active');
    if (!isActive) {
      animContainer.classList.add('active');
      if (animationConfigs["text-morph"] && animationConfigs["text-morph"].activate) {
        animationConfigs["text-morph"].activate(animContainer);
      }
    } else {
      animContainer.classList.remove('active');
      if (animationConfigs["text-morph"] && animationConfigs["text-morph"].deactivate) {
        animationConfigs["text-morph"].deactivate(animContainer);
      }
    }
  }

});
