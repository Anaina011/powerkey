// let slideIndex = 1;
// showSlides(slideIndex);

// // Next/previous controls
// function plusSlides(n) {
//     showSlides(slideIndex += n);
// }

// // Thumbnail image controls
// function currentSlide(n) {
//     showSlides(slideIndex = n);
// }

// function showSlides(n) {
//     let i;
//     let slides = document.getElementsByClassName("home_service_card");
//     let dots = document.getElementsByClassName("dot");
//     if (n > slides.length) { slideIndex = 1 }
//     if (n < 1) { slideIndex = slides.length }
//     for (i = 0; i < slides.length; i++) {
//         slides[i].style.display = "none";
//     }
//     for (i = 0; i < dots.length; i++) {
//         dots[i].className = dots[i].className.replace(" active", "");
//     }
//     slides[slideIndex - 1].style.display = "block";
//     dots[slideIndex - 1].className += " active";
// }

// // Responsive behavior
// function setSlidesVisibility() {
//     let slides = document.querySelectorAll(".home_service_card");
//     let dots = document.querySelectorAll(".dot");

//     if (window.innerWidth <= 768) {
//         // For mobile view
//         for (let i = 0; i < slides.length; i++) {
//             slides[i].style.display = "none";
//             dots[i].style.display = "none";
//         }
//         slides[slideIndex - 1].style.display = "block";
//         dots[slideIndex - 1].style.display = "block";
//     } else {
//         // For normal view (3 cards visible)
//         let startIndex = slideIndex - 1;
//         let endIndex = startIndex + 3;
//         if (endIndex > slides.length) {
//             startIndex = slides.length - 3;
//             endIndex = slides.length;
//         }

//         for (let i = 0; i < slides.length; i++) {
//             if (i >= startIndex && i < endIndex) {
//                 slides[i].style.display = "block";
//             } else {
//                 slides[i].style.display = "none";
//             }
//             dots[i].style.display = "block";
//         }
//     }
// }

// // Initialize on page load
// window.onload = setSlidesVisibility;

// // Update on window resize
// window.onresize = setSlidesVisibility;
