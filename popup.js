function DisplayReviewPopup() {
    var reviewPopup = document.querySelector('.Review_popup');
    if (reviewPopup) {
        reviewPopup.style.display = 'block';
    }
}

function CloseReviewPopup() {
    var reviewPopup = document.querySelector('.Review_popup');
    if (reviewPopup) {
        reviewPopup.style.display = 'none';
    }
}
