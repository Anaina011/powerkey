document.addEventListener("DOMContentLoaded", function() {
    function animateCounter(element, finalValue) {
        const duration = 1000; // Total animation duration in ms
        const digits = finalValue.split('');
        const digitElements = [];

        // Clear the element before starting the animation
        element.innerHTML = '';

        // Create digit elements and initialize with '0'
        digits.forEach(() => {
            const digitElement = document.createElement('span');
            digitElement.innerText = '0';
            element.appendChild(digitElement);
            digitElements.push(digitElement);
        });

        function updateDigit(digitIndex) {
            const finalDigit = parseInt(digits[digitIndex]);
            const steps = 100; // Number of steps for the animation
            const interval = duration / steps; // Interval between each step
            const stepIncrement = finalDigit / steps; // Increment per step

            let currentCount = 0;
            const digitInterval = setInterval(() => {
                currentCount += stepIncrement;
                digitElements[digitIndex].innerText = Math.floor(currentCount);

                if (Math.floor(currentCount) >= finalDigit) {
                    digitElements[digitIndex].innerText = finalDigit; // Ensure the final digit is exact
                    clearInterval(digitInterval);
                }
            }, interval);
        }

        // Start animation for each digit
        digitElements.forEach((_, i) => {
            updateDigit(i);
        });
    }

    function startCounters(entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const finalValue = counter.getAttribute("data-final");
                animateCounter(counter, finalValue);
            }
        });
    }

    const observer = new IntersectionObserver(startCounters, { threshold: 0.5 });

    const counters = document.querySelectorAll(".home_count span");
    counters.forEach(counter => {
        observer.observe(counter);
    });
});