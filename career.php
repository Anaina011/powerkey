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

    // Email details
    $to = "anainass.id@gmail.com"; // Replace with your email address
    $subject = "New Job Application for Vacancy: $vacancyId";
    $message = "
        <html>
        <head>
            <title>New Job Application</title>
        </head>
        <body>
            <h2>New Job Application</h2>
            <p><strong>Vacancy Name:</strong> $vacancyId</p>
            <p><strong>First Name:</strong> $firstName</p>
            <p><strong>Last Name:</strong> $lastName</p>
            <p><strong>Email:</strong> $email</p>
            <p><strong>Phone:</strong> $phone</p>
        </body>
        </html>
    ";

    // Boundary for separating parts of the email
    $boundary = md5(uniqid(time()));

    // Headers for the email
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

    // Sending the email
    if (mail($to, $subject, $body, $headers)) {
        echo "Application submitted successfully.";
    } else {
        echo "Error submitting application.";
    }
} else {
    echo "Invalid request.";
}
?>
