// ********************************************************************************************
// Script for submitting review popup
// ********************************************************************************************

var FullName, Email, Message;

function readReviewForm() {
    FullName = document.getElementById("fullName").value;
    Email = document.getElementById("email").value;
    Message = document.getElementById("message").value;
    console.log(FullName, Email, Message);
}

function clearReviewForm() {
    document.getElementById("fullName").value = "";
    document.getElementById("email").value = "";
    document.getElementById("message").value = "";
}

document.getElementById("submitReview").onclick = function(event) {
    event.preventDefault(); // Prevent form submission

    readReviewForm();

    if (FullName && Email && Message) {
        var timestamp = new Date().toISOString(); // Get current timestamp in ISO format

        firebase.database().ref("PendingReviews/" + FullName).set({
            name: FullName,
            email: Email,
            message: Message,
            timestamp: timestamp // Add timestamp to the review data
        }).then(() => {
            // After successfully submitting to Firebase, send notification email
            sendNotificationEmail();
            alert("Your message is submitted for reviewing");
            clearReviewForm();
        }).catch(error => {
            alert("Failed to submit review: " + error.message);
        });
    } else {
        alert("Input fields cannot be empty");
    }
};

function sendNotificationEmail() {
    // Make an AJAX call to send_notification.php
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "submit_review.php", true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200) {
            console.log(xhr.responseText); // Log the response from the PHP script
        }
    };
    xhr.send();
}