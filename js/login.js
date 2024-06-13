
// In your login.html page (after successful authentication):
var auth = firebase.auth();
auth.onAuthStateChanged(function (user) {
    if (user) {
        // User is authenticated, allow access to admin.html
        window.location.href = 'admin.html';
    }
    // else if(!user){
    //     window.location.href = 'login.html'
    // }
});



// Check if the user is logged in when the page loads
window.addEventListener("load", checkUserCred);








