<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $email = $_POST['email'];
    $encodedEmail = urlencode($email);
    $to = "anainass.id@gmail.com"; // Replace with your admin email
    $subject = "New Sign-Up Request";
    $message = "A new sign-up request has been made with the following email: $email.\n\n";
    $message .= "Click the link below to approve the signup request:\n";
    $message .= "https://demo.illforddigital.com/powerkey/approve.php?email=$encodedEmail";
    $headers = "From: anainass.id@gmail.com"; // Replace with your email

    if (mail($to, $subject, $message, $headers)) {
        echo "Email sent successfully.";
    } else {
        echo "Failed to send email.";
    }
} else {
    echo "Invalid request.";
}
?>
