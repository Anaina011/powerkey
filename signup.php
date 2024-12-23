<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $email = $_POST['email'];
    $encodedEmail = urlencode($email);
    $to = "admin@powerkeyint.com"; // Replace with your admin email
    $subject = "New Sign-Up Request";
    
    $message = "
    <html>
    <head>
        <style>
            .email-container {
                font-family: Arial, sans-serif;
                padding-top: 20px;
                padding-left: 50px;
                padding-right: 50px;
            }
            .email-content {
                font-size: 16px;
                line-height: 1.6;
            }
             .email-content h2{
                font-size: 38px;
                font-weight: 600;
                text-align: center;
            }
            .email-link-box {
                border: 1px solid #000000;
                padding: 20px;
                margin-top: 20px;
                text-align: center;
                box-shadow: -13px 16px 9px 10px rgba(0, 0, 0, 0.1);
            }
            .email-link-box a {
                text-decoration: none;
                font-size: 18px;
                font-weight: bold;
                color: #ffffff;
                background-color: #E62B00;
                padding: 10px 20px;
                border-radius: 5px;
            }
            .email-link-box a:hover {
                 background-color: #ffffff;
                color: #E62B00;
            }
            @media screen and (max-width: 500px) {
                .email-container {
                    padding: 0%;
                    align-items: center;
                 }
            }
        </style>
    </head>
    <body>
        <div class='email-container'>
            <div class='email-content'>
            <h2>Sign-Up Request</h2>
                <p>A new sign-up request has been made with the following email: <strong>$email</strong>.</p>
                <div class='email-link-box'>
                    <p>Click the link below to approve the signup request:</p>
                    <a href='https://powerkeyint.com/approve.html?email=$encodedEmail'>Approve Signup Request</a>
                </div>
            </div>
        </div>
    </body>
    </html>
    ";

    // Headers for HTML email
    $headers = "MIME-Version: 1.0" . "\r\n";
    $headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
    $headers .= "From: admin@powerkeyint.com"; // Replace with your email

    if (mail($to, $subject, $message, $headers)) {
        echo "Email sent successfully.";
    } else {
        echo "Failed to send email.";
    }
} else {
    echo "Invalid request.";
}
?>
