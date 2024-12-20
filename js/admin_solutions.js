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

// Function to update solution with a new image
function updateSolutionsWithImage(oldImageUrl) {
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

// Function to update solution details without uploading a new image
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

// Function to update solution details with or without a new image
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

// Function to clear form fields
function clearSolutionsFormFields() {
    document.getElementById("solutions_name").value = "";
    document.getElementById("solutions_description").value = "";
    document.getElementById("solutions_image").value = "";
    document.getElementById("solutions_image_url").value = "";
}

// Function to display solutions in a table
function displaySolutions() {
    var solutionsTable = document.getElementById("solutions_table").getElementsByTagName('tbody')[0];
    solutionsTable.innerHTML = ""; // Clear previous data

    // Retrieve solution data from Firebase Realtime Database
    firebase.database().ref("solutions").once("value", function (snapshot) {
        snapshot.forEach(function (childSnapshot) {
            var solutionKey = childSnapshot.key;
            var solutionData = childSnapshot.val();

            // Create table row for each solution
            var row = solutionsTable.insertRow();
            var nameCell = row.insertCell(0);
            var descriptionCell = row.insertCell(1);
            var imageCell = row.insertCell(2);
            var actionsCell = row.insertCell(3);

            // Set solution name
            nameCell.textContent = solutionData.solutions_name;

            // Set solution description
            descriptionCell.textContent = solutionData.solutions_description.join(', ');

            // Set solution image
            var solutionImage = document.createElement("img");
            solutionImage.src = solutionData.solutions_image;
            solutionImage.style.maxWidth = "100px";
            solutionImage.style.maxHeight = "100px";
            imageCell.appendChild(solutionImage);

            // Add edit and delete buttons
            var editButton = document.createElement("button");
            editButton.className = "edit-button";
            editButton.innerHTML = "<i class='fa-regular fa-pen-to-square'></i> Update";
            actionsCell.appendChild(editButton);

            var deleteButton = document.createElement("button");
            deleteButton.className = "delete-button";
            deleteButton.innerHTML = "<i class='fa-regular fa-trash-can'></i> Delete";
            actionsCell.appendChild(deleteButton);
        });
    }).catch(function (error) {
        console.error("Error retrieving solutions: ", error);
    });
}

// Call displaySolutions() to populate the table when the page loads
window.onload = function () {
    displaySolutions();
};
