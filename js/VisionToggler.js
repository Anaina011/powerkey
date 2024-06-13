// Array of texts to cycle through
var texts = [
    "<ul style='list-style-type: disc;'><li style='font-weight: 500; font-family: 'Poppins', sans-serif;'>Market Integrity: We uphold the highest standards of integrity and ethics in all our business activities, ensuring fair and transparent market practices.</li><li style='font-weight: 500; font-family: 'Poppins', sans-serif;'>Innovation: We embrace innovation and entrepreneurship, constantly seeking new opportunities and solutions to enhance our business strategies and deliver value to our clients.</li><li style='font-weight: 500; font-family: 'Poppins', sans-serif;'>Adaptability: We are agile and adaptable, able to quickly respond to changing market conditions and client needs, ensuring we remain competitive and relevant in dynamic environments.</li></ul>",
    "<ul style='list-style-type: disc;'><li style='font-weight: 500; font-family: 'Poppins', sans-serif;'>To become a leading company in the Oil and Gas industry in the supply and service of Green Nanotechnology and Chemical solutions in MENA region by 2030.</li></ul>",
    "<ul style='list-style-type: disc;'><li style='font-weight: 500; font-family: 'Poppins', sans-serif;'>To deliver planned and flawlessly executed solutions and achieve the highest level of client satisfaction.</li></ul>"
];

// Array of image sources to cycle through
var images = [
    "img/home_values.png",
    "img/home_visionn.png",
    "img/home_mission.png"
    
];

var currentIndex = 0;
var changingTextElement = document.getElementById("changingText");
var changingImageElement = document.getElementById("changingImage");

function changeTextAndImage() {
    changingTextElement.innerHTML = texts[currentIndex];
    changingImageElement.src = images[currentIndex];
    currentIndex = (currentIndex + 1) % texts.length;
}

// Call the 'changeTextAndImage' function every 2 seconds
setInterval(changeTextAndImage, 4000);
