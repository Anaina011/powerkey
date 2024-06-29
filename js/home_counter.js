document.addEventListener("DOMContentLoaded", function() {
    function animateCounter(element, finalValue) {
        const duration = 3000; // Total animation duration in ms
        const increment = finalValue / (duration / 10); // Calculate increment for 2 seconds
        let currentValue = 0;

        const interval = setInterval(() => {
            currentValue += increment;
            if (currentValue >= finalValue) {
                currentValue = finalValue;
                clearInterval(interval);
            }
            element.textContent = Math.floor(currentValue);
        }, 10); // Update every 10 milliseconds
    }

    function startCounters(entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const finalValue = parseInt(counter.getAttribute("data-final"));
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
