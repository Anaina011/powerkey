// Get all the div elements with class name 'home_vision'
var homeVisionDivs = document.querySelectorAll('.home_vision ');
var currentIndex = 0;

// Function to change background color of the divs
function changeColor() {
    // Reset background color of all divs to white
    homeVisionDivs.forEach(function(div) {
        div.style.backgroundImage = 'none'; // Remove any existing background image
        div.style.backgroundColor = 'white'; // Set background color to white
    });

    // Change background to linear gradient for the current div
    homeVisionDivs[currentIndex].style.background = 'linear-gradient(to bottom, #F7E91C, #FE820A, #CC0D0C)';
    
    // Move to the next div
    currentIndex = (currentIndex + 1) % homeVisionDivs.length;
}

// Call the 'changeColor' function every 2 seconds
setInterval(changeColor, 4000);
