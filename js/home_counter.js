document.addEventListener("DOMContentLoaded", function() {
  function animateCounter(element, finalValue) {
      const duration = 3000; // Animation duration in ms
      const initial = "0".repeat(finalValue.length).split('');
      const final = finalValue.split('');

      function updateDigit(digitIndex) {
          const digitElement = document.createElement('span');
          digitElement.innerText = '0';
          element.appendChild(digitElement);

          const interval = setInterval(() => {
              let currentValue = parseInt(digitElement.innerText);
              currentValue = (currentValue + 1) % 10;
              digitElement.innerText = currentValue;

              // Stop the interval when the final value is reached
              if (currentValue == final[digitIndex]) {
                  clearInterval(interval);
              }
          }, duration / 20);
      }

      // Clear the element before starting the animation
      element.innerHTML = '';

      // Start animation for each digit
      for (let i = 0; i < final.length; i++) {
          updateDigit(i);
      }

      // Repeat the animation after the duration
      setTimeout(() => {
          animateCounter(element, finalValue);
      }, duration);
  }

  // Initialize counters
  const counters = document.querySelectorAll(".home_count span");
  counters.forEach(counter => {
      const finalValue = counter.getAttribute("data-final");
      animateCounter(counter, finalValue);
  });
});
