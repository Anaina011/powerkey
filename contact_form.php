<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $name = htmlspecialchars(trim($_POST['name']));
    $email = htmlspecialchars(trim($_POST['email']));
    $number = htmlspecialchars(trim($_POST['number']));
    $message = htmlspecialchars(trim($_POST['message']));

    // Validate inputs
    if (empty($name) || empty($email) || empty($number) || empty($message)) {
        echo "All fields are required.";
        exit;
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo "Invalid email format.";
        exit;
    }

    // Email parameters
    $to = "anainass.id@gmail.com"; // Change this to your email address
    $subject = "New Contact Request";
    $body = "Name: $name\nEmail: $email\nPhone: $number\n\nMessage:\n$message";
    $headers = "From: $email";

    // Send email
    if (mail($to, $subject, $body, $headers)) {
        echo "<script type='text/javascript'>alert('Email sent successfully.'); window.location.href = 'contact.html';</script>";
    } else {
                echo "<script type='text/javascript'>alert('Failed to send message.'); window.location.href = 'contact.html';</script>";
    }
}
?>
