<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $email = $_POST['email'];

    // Include Firebase PHP JWT library
    require 'vendor/autoload.php';
    use Firebase\Auth\Token\Handler as TokenHandler;
    use Kreait\Firebase\Factory;
    use Kreait\Firebase\ServiceAccount;

    // Initialize Firebase
    $serviceAccount = ServiceAccount::fromJsonFile(__DIR__.'/path/to/serviceAccountKey.json');
    $firebase = (new Factory)
        ->withServiceAccount($serviceAccount)
        ->withDatabaseUri('https://power-49793-default-rtdb.firebaseio.com')
        ->create();

    $auth = $firebase->getAuth();

    try {
        $auth->sendPasswordResetLink($email);
        echo "Password reset email sent successfully.";
    } catch (\Kreait\Firebase\Exception\Auth\AuthError $e) {
        echo "Failed to send password reset email: " . $e->getMessage();
    }
} else {
    echo "Invalid request.";
}
?>
