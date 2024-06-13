// Get all the div elements with class name 'home_vision'
var homeVisionDivs = document.querySelectorAll('.home_vision h3');
var currentIndex = 0;

// Function to change background color of the divs
function changeColor() {
    // Reset background color of all divs to white
    homeVisionDivs.forEach(function(div) {
        div.style.backgroundImage = 'none'; // Remove any existing background image
        div.style.backgroundColor = 'white'; // Set background color to white
    });

    // Change background to linear gradient for the current div
    homeVisionDivs[currentIndex].style.background = 'linear-gradient(to bottom, #E62B00, #E25D00)';
    
    // Move to the next div
    currentIndex = (currentIndex + 1) % homeVisionDivs.length;
}

// Call the 'changeColor' function every 2 seconds
setInterval(changeColor, 4000);
