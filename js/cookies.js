window.addEventListener('scroll', function () {
    // Check if the cookies div has already been closed
    if (localStorage.getItem('cookiesAccepted') === 'true') {
        return;
    }

    var scrollPosition = window.scrollY + window.innerHeight;
    var documentHeight = document.documentElement.scrollHeight;

    // Check if user is 100px from the bottom
    if (scrollPosition >= documentHeight - 100) {
        document.getElementById('cookies_float').style.display = 'flex';
    }
});

document.querySelectorAll('.coookie_buttons button').forEach(button => {
    button.addEventListener('click', function () {
        document.querySelectorAll('.cookies_float').forEach(element => {
            element.style.display = 'none';
        });
        // Set a flag in localStorage to indicate that the cookies div has been closed
        localStorage.setItem('cookiesAccepted', 'true');
    });
});