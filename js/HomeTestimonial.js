
const testimonials = [];
let currentTestimonialIndex = 0;
const testimonialElement = document.getElementById('testimonial1');
const reviewNameElement = document.getElementById('reviewName');

function updateTestimonial() {
    if (testimonials.length > 0) {
        testimonialElement.textContent = testimonials[currentTestimonialIndex].content;
        reviewNameElement.innerHTML = `<h4>${testimonials[currentTestimonialIndex].name}</h4>`;
    }
}

function showNextTestimonial() {
    currentTestimonialIndex++;
    if (currentTestimonialIndex >= testimonials.length) {
        currentTestimonialIndex = 0;
    }
    updateTestimonial();
}

function showPrevTestimonial() {
    currentTestimonialIndex--;
    if (currentTestimonialIndex < 0) {
        currentTestimonialIndex = testimonials.length - 1;
    }
    updateTestimonial();
}

const nextTestimonialButton = document.getElementById('nextTestimonial');
nextTestimonialButton.addEventListener('click', showNextTestimonial);

const prevTestimonialButton = document.getElementById('prevTestimonial');
prevTestimonialButton.addEventListener('click', showPrevTestimonial);

// Fetch latest 3 reviews from Firebase ordered by timestamp
firebase.database().ref('approvedReviews').orderByChild('timestamp').limitToLast(3).once('value').then((snapshot) => {
    snapshot.forEach((childSnapshot) => {
        const review = childSnapshot.val();
        testimonials.unshift({
            content: review.message,
            name: review.name
        });
    });

    // Initial testimonial display
    updateTestimonial();
}).catch((error) => {
    console.error('Error fetching reviews: ', error);
});


