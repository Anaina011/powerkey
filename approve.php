<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $email = $_POST['email'];
    $password = $_POST['password'];

    $to = $email;
    $subject = "Your Account Has Been Approved";
    $message = "Your account has been approved. Here are your login credentials:\n\n";
    $message .= "Email: $email\n";
    $message .= "Password: $password\n\n";
    $message .= "You can now log in to your account.";
    $headers = "From: anainass.id@gmail.com"; // Replace with your email

    if (mail($to, $subject, $message, $headers)) {
        echo "User added and email sent successfully.";
    } else {
        echo "Failed to send email.";
    }
} else {
    echo "Invalid request.";
}
?>
