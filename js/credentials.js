// Variables for auto-logout
let logoutTimer;

// Function to handle auto-logout after inactivity
function startAutoLogoutTimer() {
    // Set the timer for 30 minutes (1800000 milliseconds)
    const autoLogoutTime = 15000;

    // Clear any existing timer
    if (logoutTimer) {
        clearTimeout(logoutTimer);
    }

    // Set a new timer
    logoutTimer = setTimeout(() => {
        firebase.auth().signOut().then(() => {
            
            window.location.href = "login.html"; // Redirect to login page
        }).catch((error) => {
            console.error("Error signing out: ", error);
        });
    }, autoLogoutTime);
}

// Function to reset the auto-logout timer
function resetAutoLogoutTimer() {
    startAutoLogoutTimer();
}

// Event listeners to reset the auto-logout timer on user interactions
document.addEventListener("mousemove", resetAutoLogoutTimer);
document.addEventListener("keypress", resetAutoLogoutTimer);

// Function to handle login
function login() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    firebase.auth().signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            // Redirect to dashboard after successful login
            window.location.href = "dashboard.html";
        })
        .catch((error) => {
            console.error("Error signing in: ", error);
            alert("Login failed: " + error.message);
        });
}

// Function to handle logout
function logout() {
    firebase.auth().signOut()
        .then(() => {
            // Redirect to login page after successful logout
            window.location.href = "login.html";
        })
        .catch((error) => {
            console.error("Error signing out: ", error);
        });
}

// Function to check user authentication state and redirect accordingly
firebase.auth().onAuthStateChanged((user) => {
    const currentPage = window.location.pathname;

    if (user) {
        // If user is logged in and on login page, redirect to dashboard
        if (currentPage.includes("login.html")) {
            window.location.href = "dashboard.html";
        } else {
            // Start the auto-logout timer if on the dashboard page
            if (currentPage.includes("dashboard.html")) {
                startAutoLogoutTimer();
            }
        }
    } else {
        // If user is not logged in and not on login page, redirect to login page
        if (!currentPage.includes("login.html")) {
            window.location.href = "login.html";
        }
    }
});
// Ensure that these scripts are included in your dashboard page
document.addEventListener("DOMContentLoaded", function () {
    // Check user authentication state on page load
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            // User is authenticated, load dashboard data
            fetchProducts();
            fetchProjects();
            fetchVacancies();
            refreshPendingReviewsTable();
            refreshApprovedReviewsTable();
        } else {
            // User is not authenticated, redirect to login page
            window.location.href = "login.html";
        }
    });

    // Attach event listeners for login and logout buttons
    document.getElementById("login_button").addEventListener("click", login);
    document.getElementById("logout_button").addEventListener("click", logout);
});


function logoutUser() {
    const confirmation = confirm("Are you sure you want to log out?");
    if (confirmation) {
        firebase.auth().signOut().then(() => {
            localStorage.clear();
            sessionStorage.clear();
            window.location.href = 'index.html';
        }).catch((error) => {
            console.error(error.message);
        });
    }
}

firebase.auth().onAuthStateChanged(function (user) {
    if (!user) {
        window.location.href = 'login.html';
    }
});

document.getElementById("signoutbtn").addEventListener("click", logoutUser);

function checkUserCred() {
    firebase.auth().onAuthStateChanged(function (user) {
        if (!user) {
            window.location.href = 'login.html';
        }
    });
}