

<?php
    // Email configuration
    $to = "anainass.id@gmail.com";
    $subject = "New review submission ";
    $message = "You have a new review submission \n";
    $message .= "Click the link below to access dashboard \n";
    $message .= "https://dummylink.com";

    // Additional headers for the main email
    $headers = "From: Admin\r\n";
    $headers .= "Reply-To: Admin\r\n";
    $headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

    // Sending email to main recipient
    if (mail($to, $subject, $message, $headers)) {

        echo "<script type='text/javascript'>alert('Your message has been sent successfully.');window.location.href = 'index.html';</script>";
    } else {
        echo "<script type='text/javascript'>alert('Failed to send message. Please try again later.');window.location.href = 'index.html';</script>";
    }


?>
