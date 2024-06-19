// ********************************************************************************************
// Function to logout user after 1 hour of inactivity since last user activity
// ********************************************************************************************

window.onload = function () {
    console.log('***')
    // Function to handle user logout
    function logoutUser() {
        console.log("Logging out user due to inactivity or tab/window close");
        auth.signOut().then(() => {
            // Clear any user session data
            localStorage.clear();
            sessionStorage.clear();

            // Redirect to login page after logout
            window.location.href = 'index.html';
        });
    }

    // Function to set login time
    function setLoginTime() {
        var loginTime = new Date().getTime();
        localStorage.setItem('loginTime', loginTime);
        console.log("Login time set at: " + new Date(loginTime));
    }

    // Function to check inactivity based on login time
    function checkInactivity() {
        var loginTime = localStorage.getItem('loginTime');
        if (loginTime) {
            var currentTime = new Date().getTime();
            var timeSinceLogin = currentTime - loginTime;

            if (timeSinceLogin > 15 * 60 * 1000) { // 1 hour
                logoutUser();
            } else {
                // Reset the inactivity timeout to check again after the remaining time
                var remainingTime = 15 * 60 * 1000 - timeSinceLogin;
                clearTimeout(inactivityTimeout);
                inactivityTimeout = setTimeout(logoutUser, remainingTime);
            }
        }
    }

    // Set login time on load if not already set
    if (!localStorage.getItem('loginTime')) {
        setLoginTime();
    }

    // Check inactivity on page load/reload
    checkInactivity();

    // Event listeners for user activity to reset login time
    document.addEventListener("mousemove", function () {
        setLoginTime();
        checkInactivity();
    });

    document.addEventListener("keypress", function () {
        setLoginTime();
        checkInactivity();
    });

    // Variable to store the inactivity timeout
    var inactivityTimeout;

    // Log out the user when closing the tab or browser
    window.addEventListener("beforeunload", function () {
        logoutUser();
    });


    window.addEventListener('unload', function () {
        logoutUser();
    });

};









function logoutUser() {
    const confirmation = confirm("Are you sure you want to log out?");
    if (confirmation) {
        auth.signOut().then(() => {
            // Clear any user session data
            // For example, clear any local storage or session storage
            localStorage.clear(); // You can use sessionStorage.clear() if you're using sessionStorage
            sessionStorage.clear();
            // Redirect to home page after logout
            window.location.href = 'index.html';
        }).catch((error) => {
            console.error(error.message);
        });
    }

}


// In your login.html page (after successful authentication):
var auth = firebase.auth();
auth.onAuthStateChanged(function (user) {
    if (!user) {
        // User is authenticated, allow access to admin.html
        window.location.href = 'login.html';
    }
});


// Add an event listener to the Log Out button
const signoutBtn = document.getElementById("signoutbtn");
signoutBtn.addEventListener("click", logoutUser);

// Check if the user is logged in when the page loads
window.addEventListener("load", checkUserCred);
