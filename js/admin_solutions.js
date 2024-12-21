// ADMIN DASHBOARD FOR SOLUTIONS

var Solutionsname, Solutionsdescription, Solutionsimage;

// Function to read form data
function readSolutionsForm() {
    Solutionsname = document.getElementById("solutions_name").value;
    Solutionsdescription = document.getElementById("solutions_description").value.split('\n').map(point => point.trim());
    Solutionsimage = document.getElementById("solutions_image").files[0]; // Get the file object
}

document.getElementById("save_solutions").onclick = function (event) {
    event.preventDefault(); // Prevent form submission
    readSolutionsForm();

    // Check if all fields are filled
    if (!Solutionsname || !Solutionsdescription) {
        alert("Name and Description are required");
        return;
    }

    // Check if the solution already exists
    firebase.database().ref("solutions/" + Solutionsname).once("value").then(function (snapshot) {
        if (snapshot.exists()) {
            // Solution exists, update it
            if (Solutionsimage) {
                // Update solution with a new image
                updateSolutionsWithImage(snapshot.val().solutions_image);
            } else {
                // Update solution without a new image
                updateSolutionsDetails(Solutionsname, Solutionsdescription);
            }
        } else {
            // Solution doesn't exist, add a new one
            if (Solutionsimage) {
                // Add new solution with an image
                addNewSolutions();
            } else {
                alert("Image is required for adding a new solution");
            }
        }
    }).catch(function (error) {
        alert("Failed to check solution existence: " + error.message);
    });
};

function updateSolutionsWithImage(oldImageUrl) {
    var storageRef = firebase.storage().ref();
    var imageRef = storageRef.child('solutions_images/' + Solutionsname + '_' + Date.now()); // Unique filename

    var uploadTask = imageRef.put(Solutionsimage);

    uploadTask.on('state_changed', function(snapshot) {
        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        // Show progress here (optional)
    }, function(error) {
        alert("Failed to upload image: " + error.message);
    }, function() {
        uploadTask.snapshot.ref.getDownloadURL().then(function(url) {
            var oldImageRef = firebase.storage().refFromURL(oldImageUrl);
            oldImageRef.delete().then(function() {
                updateSolutions(Solutionsname, Solutionsdescription, url);
            }).catch(function(error) {
                alert("Failed to delete old image: " + error.message);
            });
        }).catch(function(error) {
            alert("Failed to get image download URL: " + error.message);
        });
    });
}


// Function to add a new solution
function addNewSolutions() {
    var storageRef = firebase.storage().ref();
    var imageRef = storageRef.child('solutions_images/' + Solutionsname + '_' + Date.now());

    var uploadTask = imageRef.put(Solutionsimage);

    uploadTask.on('state_changed', function(snapshot) {
        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        // Show progress here
    }, function(error) {
        alert("Failed to upload image: " + error.message);
    }, function() {
        uploadTask.snapshot.ref.getDownloadURL().then(function(url) {
            firebase.database().ref("solutions/" + Solutionsname).set({
                solutions_name: Solutionsname,
                solutions_description: Solutionsdescription,
                solutions_image: url
            }).then(() => {
                alert("Solution added successfully");
                clearSolutionsFormFields();
                displaySolutions(); // Refresh the table
            }).catch(error => {
                alert("Failed to add solution: " + error.message);
            });
        }).catch(function(error) {
            alert("Failed to get image download URL: " + error.message);
        });
    });
}

function updateSolutionsDetails(name, description) {
    firebase.database().ref("solutions/" + name).update({
        solutions_name: name,
        solutions_description: description
    }).then(() => {
        alert("Solution updated successfully");
        clearSolutionsFormFields();
        displaySolutions(); // Refresh the table
    }).catch(error => {
        alert("Failed to update solution: " + error.message);
    });
}


function updateSolutions(name, description, imageUrl) {
    firebase.database().ref("solutions/" + name).set({
        solutions_name: name,
        solutions_description: description,
        solutions_image: imageUrl
    }).then(() => {
        alert("Solution updated successfully");
        clearSolutionsFormFields();
        displaySolutions(); // Refresh the table
    }).catch(error => {
        alert("Failed to update solution: " + error.message);
    });
}

function deleteSolution(solutionName) {
    var confirmation = confirm("Are you sure you want to delete this solution?");
    if (confirmation) {
        var solutionRef = firebase.database().ref("solutions/" + solutionName);

        solutionRef.once("value", function(snapshot) {
            var solutionData = snapshot.val();
            var imageRef = firebase.storage().refFromURL(solutionData.solutions_image);

            // First, delete the image from Firebase Storage
            imageRef.delete().then(function() {
                // Then, delete the solution data from Firebase Realtime Database
                solutionRef.remove().then(function() {
                    alert("Solution deleted successfully");
                    displaySolutions(); // Refresh the table
                }).catch(function(error) {
                    alert("Failed to delete solution from database: " + error.message);
                });
            }).catch(function(error) {
                alert("Failed to delete image: " + error.message);
            });
        });
    }
}


// Function to clear form fields
function clearSolutionsFormFields() {
    document.getElementById("solutions_name").value = "";
    document.getElementById("solutions_description").value = "";
    document.getElementById("solutions_image").value = "";
    document.getElementById("solutions_image_url").value = "";
}

function displaySolutions() {
    var solutionsTable = document.getElementById("solutions_table").getElementsByTagName('tbody')[0];
    solutionsTable.innerHTML = ""; // Clear previous data

    // Retrieve solution data from Firebase
    firebase.database().ref("solutions").once("value", function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
            var solutionData = childSnapshot.val();

            // Create table row for each solution
            var row = solutionsTable.insertRow();
            var nameCell = row.insertCell(0);
            var descriptionCell = row.insertCell(1);
            var imageCell = row.insertCell(2);
            var actionsCell = row.insertCell(3);

            nameCell.textContent = solutionData.solutions_name;
            descriptionCell.textContent = solutionData.solutions_description.join(', ');
            var solutionImage = document.createElement("img");
            solutionImage.src = solutionData.solutions_image;
            solutionImage.style.maxWidth = "100px";
            solutionImage.style.maxHeight = "100px";
            imageCell.appendChild(solutionImage);

            // Add edit and delete buttons
            var editButton = document.createElement("button");
            editButton.className = "edit-button";
            editButton.innerHTML = "<i class='fa-regular fa-pen-to-square'></i> Update";
            editButton.onclick = function() {
                // Populate the form with the solution data for editing
                document.getElementById("solutions_name").value = solutionData.solutions_name;
                document.getElementById("solutions_description").value = solutionData.solutions_description.join('\n'); // Convert array to string
                document.getElementById("solutions_image_url").value = solutionData.solutions_image; // Populate image URL
                Solutionsname = solutionData.solutions_name;
                Solutionsdescription = solutionData.solutions_description;
                Solutionsimage = solutionData.solutions_image;
            };
            actionsCell.appendChild(editButton);

            var deleteButton = document.createElement("button");
            deleteButton.className = "delete-button";
            deleteButton.innerHTML = "<i class='fa-regular fa-trash-can'></i> Delete";
            deleteButton.onclick = function() {
                deleteSolution(solutionData.solutions_name);
            };
            actionsCell.appendChild(deleteButton);
        });
    }).catch(function(error) {
        console.error("Error retrieving solutions: ", error);
    });
}

// Call this after adding or updating a solution
displayProducts();
displayProjects();


// Call displaySolutions() to populate the table when the page loads
window.onload = function () {
    displaySolutions();
};
