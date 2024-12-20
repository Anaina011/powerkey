<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $name = htmlspecialchars(trim($_POST['name']));
    $email = htmlspecialchars(trim($_POST['email']));
    $number = htmlspecialchars(trim($_POST['number']));
    $services = htmlspecialchars(trim($_POST['services']));
    $message = htmlspecialchars(trim($_POST['message']));

    // Validation
    if (empty($name) || empty($email) || empty($number) || empty($services) || empty($message)) {
        echo "All fields are required.";
        exit;
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo "Invalid email format.";
        exit;
    }

    $to = "admin@powerkeyint.com"; // Replace with your email address
    $subject = "New Contact Request";
    $body = "Name: $name\nEmail: $email\nPhone Number: $number\nServices: $services\nMessage: $message";
    $headers = "From: $email";

    // Send email
    if (mail($to, $subject, $body, $headers)) {
        echo "<script type='text/javascript'>alert('Email sent successfully.'); window.location.href = 'index.html#home_contact_section';</script>";
    } else {
        echo "<script type='text/javascript'>alert('Failed to send message.'); window.location.href = 'index.html#home_contact_section';</script>";
    }
}
?>
