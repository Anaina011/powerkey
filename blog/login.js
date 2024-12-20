// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAXzO9gcjdPf8P8-z476SsryKUgNVAuneA",
    authDomain: "powerkeyint.firebaseapp.com",
    databaseURL: "https://powerkeyint-default-rtdb.firebaseio.com",
    projectId: "powerkeyint",
    storageBucket: "powerkeyint.appspot.com",
    messagingSenderId: "762411477471",
    appId: "1:762411477471:web:4d7497bfa3a1ade7817c6a"
  };
  
      // Initialize Firebase
      firebase.initializeApp(firebaseConfig);
  
  

// Handle login
document.getElementById('loginBtn').addEventListener('click', function () {
    var email = document.getElementById('email').value;
    var password = document.getElementById('password').value;

    firebase.auth().signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            // Signed in 
            var user = userCredential.user;
            // Redirect to blog.html
            window.location.href = 'admin.html';
        })
        .catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;
            alert('Error: ' + errorMessage);
        });
});

// Handle forgot password
document.getElementById('forgotPasswordLink').addEventListener('click', function () {
    var email = document.getElementById('email').value;

    if (email) {
        firebase.auth().sendPasswordResetEmail(email)
            .then(() => {
                alert('Password reset email sent!');
            })
            .catch((error) => {
                var errorCode = error.code;
                var errorMessage = error.message;
                alert('Error: ' + errorMessage);
            });
    } else {
        alert('Please enter your email address.');
    }
});
