window.onload = () => {
    const counters = [
      { element: document.getElementById('counter1'), target: 124 },
      { element: document.getElementById('counter2'), target: 6758 },
      { element: document.getElementById('counter3'), target: 18 }
    ];
  
    counters.forEach(counter => {
      let count = 0;
      let duration = 2000; // Duration in milliseconds (2 seconds)
      let increment = counter.target / (duration / 10); // Calculate increment for 2 seconds
  
      let interval = setInterval(() => {
        count += increment;
        if (count >= counter.target) {
          count = counter.target;
          clearInterval(interval);
        }
        counter.element.textContent = Math.floor(count);
      }, 10); // Update every 10 milliseconds
    });
  };