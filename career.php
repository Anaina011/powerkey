<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Collect form data
    $vacancyId = $_POST['vacancy_id'];
    $firstName = $_POST['first_name'];
    $lastName = $_POST['last_name'];
    $email = $_POST['email'];
    $phone = $_POST['phone'];
    $resume = $_FILES['resume'];

    // Validate vacancyId
    if (empty($vacancyId)) {
        die("Invalid vacancy ID.");
    }

    // Email details for admin notification
    $to = "anainass.id@gmail.com"; // Replace with your email address
    $subject = "New Job Application for Vacancy: $vacancyId";
    $message = "
        <html>
        <head>
            <title>New Job Application</title>
            <style>
                .container {
                    border: 2px solid #E62B00;
                    padding: 20px;
                    max-width: 600px;
                    margin: auto;
                }
                .header {
                    text-align: center;
                }
                .header img {
                    max-width: 100px;
                }
            </style>
        </head>
        <body>
            <div class='container'>
                <div class='header'>
                    <img src='https://demo.illforddigital.com/powerkey/img/powerkey_logo.webp' alt='Company Logo'>
                    <h1>Power Key International LLC</h1>
                </div>
                <h2>New Job Application</h2>
                <p><strong>Vacancy Name:</strong> $vacancyId</p>
                <p><strong>First Name:</strong> $firstName</p>
                <p><strong>Last Name:</strong> $lastName</p>
                <p><strong>Email:</strong> $email</p>
                <p><strong>Phone:</strong> $phone</p>
            </div>
        </body>
        </html>
    ";

    // Boundary for separating parts of the email
    $boundary = md5(uniqid(time()));

    // Headers for the admin email
    $headers = "MIME-Version: 1.0\r\n";
    $headers .= "Content-Type: multipart/mixed; boundary=\"$boundary\"\r\n";
    $headers .= "From: $email\r\n";

    // Message body with boundary
    $body = "--$boundary\r\n";
    $body .= "Content-Type: text/html; charset=UTF-8\r\n";
    $body .= "Content-Transfer-Encoding: 7bit\r\n\r\n";
    $body .= $message . "\r\n";
    $body .= "--$boundary\r\n";

    // Handling the file attachment
    if ($resume["error"] == UPLOAD_ERR_OK) {
        $fileName = $resume["name"];
        $fileType = $resume["type"];
        $fileContent = chunk_split(base64_encode(file_get_contents($resume["tmp_name"])));

        $body .= "Content-Type: $fileType; name=\"$fileName\"\r\n";
        $body .= "Content-Disposition: attachment; filename=\"$fileName\"\r\n";
        $body .= "Content-Transfer-Encoding: base64\r\n\r\n";
        $body .= $fileContent . "\r\n";
        $body .= "--$boundary--";
    }

    // Sending the email to admin
    if (mail($to, $subject, $body, $headers)) {
        // Send confirmation email to the applicant
        $replySubject = "Thank you for your application";
        $replyMessage = "
            <html>
            <head>
                <title>Thank You for Your Application</title>
                <style>
                    .container {
                        border: 2px solid #E62B00;
                        padding: 20px;
                        max-width: 600px;
                        margin: auto;
                    }
                    .header {
                        text-align: center;
                    }
                    .header img {
                        max-width: 100px;
                    }
                </style>
            </head>
            <body>
                <div class='container'>
                    <div class='header'>
                        <img src='https://demo.illforddigital.com/powerkey/img/powerkey_logo.webp' alt='Company Logo'>
                        <h1>Power Key International LLC</h1>
                    </div>
                    <h2>Dear $firstName $lastName,</h2>
                    <p>Thank you for applying for the <strong>$vacancyId</strong> position. We have received your application and will review it shortly.</p>
                    <p>Best regards,</p>
                    <p>Power Key International LLC</p>
                </div>
            </body>
            </html>
        ";
        $replyHeaders = "MIME-Version: 1.0\r\n";
        $replyHeaders .= "Content-Type: text/html; charset=UTF-8\r\n";
        $replyHeaders .= "From: anainass.id@gmail.com\r\n"; // Replace with your email address

        mail($email, $replySubject, $replyMessage, $replyHeaders);

        echo "<script type='text/javascript'>alert('Email sent successfully.'); window.location.href = 'career.html';</script>";
    } else {
        echo "<script type='text/javascript'>alert('Failed to send message.'); window.location.href = 'career.html';</script>";
    }
} else {
    echo "Invalid request.";
}
?>
