  const volumeSlider = document.getElementById("volume");
      const volumeValue = document.getElementById("volumeValue");

      if (volumeSlider && volumeValue) {
        volumeSlider.addEventListener("input", (e) => {
          volumeValue.textContent = e.target.value;
        });
      }

      // Prevent actual form submissions for demo
      document.querySelectorAll("form").forEach((form) => {
        form.addEventListener("submit", (e) => {
          e.preventDefault();
          alert("Form submitted successfully! (Demo mode)");
        });
      });
