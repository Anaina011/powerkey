// ADMIN DASHBOARD FOR PRODUCTS

// Variable declarations
var Productname, Productdetails, Productimage;

// Function to read form data
function readform() {
    Productname = document.getElementById("product_name").value;
    Productdetails = document.getElementById("product_details").value.split('\n').map(point => point.trim()); // Split points by newline and trim whitespace
    Productimage = document.getElementById("product_image").files[0]; // Get the file object
}

document.getElementById("save").onclick = function (event) {
    event.preventDefault(); // Prevent form submission
    readform();

    // Check if all fields are filled
    if (!Productname || !Productdetails) {
        alert("Name and Details are required");
        return;
    }

    // Check if the product already exists
    firebase.database().ref("product/" + Productname).once("value").then(function (snapshot) {
        if (snapshot.exists()) {
            // Product exists, update it
            if (Productimage) {
                // Update product with a new image
                updateProductWithImage(snapshot.val().product_image);
            } else {
                // Update product without a new image
                updateProductDetails(Productname, Productdetails);
            }
        } else {
            // Product doesn't exist, add a new one
            if (Productimage) {
                // Add new product with an image
                addNewProduct();
            } else {
                alert("Image is required for adding a new product");
            }
        }
    }).catch(function (error) {
        alert("Failed to check product existence: " + error.message);
    });
};


function updateProductWithImage(oldImageUrl) {
    var storageRef = firebase.storage().ref();
    var imageRef = storageRef.child('product_images/' + Productname + '_' + Date.now()); // Unique filename

    var uploadTask = imageRef.put(Productimage);

    // Show the progress bar
    document.getElementById('progress-container').style.display = 'block';

    uploadTask.on('state_changed', function(snapshot) {
        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        document.getElementById('upload-progress').value = progress;
        document.getElementById('progress-percentage').textContent = Math.round(progress) + '%';
    }, function(error) {
        alert("Failed to upload image: " + error.message);
        // Hide the progress bar
        document.getElementById('progress-container').style.display = 'none';
    }, function() {
        uploadTask.snapshot.ref.getDownloadURL().then(function(url) {
            var oldImageRef = firebase.storage().refFromURL(oldImageUrl);
            oldImageRef.delete().then(function() {
                updateProduct(Productname, Productdetails, url);
                // Hide the progress bar
                document.getElementById('progress-container').style.display = 'none';
            }).catch(function(error) {
                alert("Failed to delete old image: " + error.message);
            });
        }).catch(function(error) {
            alert("Failed to get image download URL: " + error.message);
        });
    });
}

function addNewProduct() {
    var storageRef = firebase.storage().ref();
    var imageRef = storageRef.child('product_images/' + Productname + '_' + Date.now()); // Unique filename

    var uploadTask = imageRef.put(Productimage);

    // Show the progress bar
    document.getElementById('progress-container').style.display = 'block';

    uploadTask.on('state_changed', function(snapshot) {
        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        document.getElementById('upload-progress').value = progress;
        document.getElementById('progress-percentage').textContent = Math.round(progress) + '%';
    }, function(error) {
        alert("Failed to upload image: " + error.message);
        // Hide the progress bar
        document.getElementById('progress-container').style.display = 'none';
    }, function() {
        uploadTask.snapshot.ref.getDownloadURL().then(function(url) {
            firebase.database().ref("product/" + Productname).set({
                product_name: Productname,
                product_details: Productdetails,
                product_image: url
            }).then(() => {
                alert("Product added successfully");
                clearFormFields();
                displayProducts(); // Refresh the table
                // Hide the progress bar
                document.getElementById('progress-container').style.display = 'none';
            }).catch(error => {
                alert("Failed to add product: " + error.message);
            });
        }).catch(function(error) {
            alert("Failed to get image download URL: " + error.message);
        });
    });
}


// Function to update product details without uploading a new image
function updateProductDetails(name, details) {
    firebase.database().ref("product/" + name).update({
        product_name: name,
        product_details: details
    }).then(() => {
        alert("Product updated successfully");
        clearFormFields();
        displayProducts(); // Refresh the table
    }).catch(error => {
        alert("Failed to update product: " + error.message);
    });
}

// Function to update product details with or without a new image
function updateProduct(name, details, imageUrl) {
    firebase.database().ref("product/" + name).set({
        product_name: name,
        product_details: details,
        product_image: imageUrl
    }).then(() => {
        alert("Product updated successfully");
        clearFormFields();
        displayProducts(); // Refresh the table
    }).catch(error => {
        alert("Failed to update product: " + error.message);
    });
}

// Function to clear form fields
function clearFormFields() {
    document.getElementById("product_name").value = "";
    document.getElementById("product_details").value = "";
    document.getElementById("product_image").value = "";
    document.getElementById("product_image_url").value = "";
}

// Function to display products in a table
function displayProducts() {
    console.log("Displaying products...");
    var productsTable = document.getElementById("products_table").getElementsByTagName('tbody')[0];
    productsTable.innerHTML = ""; // Clear previous data

    // Retrieve product data from Firebase Realtime Database
    firebase.database().ref("product").once("value", function (snapshot) {
        snapshot.forEach(function (childSnapshot) {
            var productKey = childSnapshot.key;
            var productData = childSnapshot.val();

            // Create table row for each product
            var row = productsTable.insertRow();
            var nameCell = row.insertCell(0);
            var detailsCell = row.insertCell(1);
            var imageCell = row.insertCell(2);
            var actionsCell = row.insertCell(3);

            // Set product name
            nameCell.textContent = productData.product_name;
            nameCell.className = "product-name-cell";

            // Set product details as a list
            var detailsWrapper = document.createElement("div");
            detailsWrapper.className = "details-wrapper collapsed";
            detailsWrapper.style.maxWidth = "250px"; // Set maximum width of details column
            detailsWrapper.style.overflow = "hidden";
            detailsWrapper.style.whiteSpace = "pre-wrap"; // Ensure text wraps properly
            detailsWrapper.style.maxHeight = "4.5em"; // Initial max height for collapse

            var detailsList = document.createElement("ul");
            productData.product_details.forEach(function (point) {
                var listItem = document.createElement("li");
                listItem.textContent = point;
                detailsList.appendChild(listItem);
            });
            detailsWrapper.appendChild(detailsList);

            detailsCell.appendChild(detailsWrapper);

            // Create expand/collapse button
            var expandButton = document.createElement("button");
            expandButton.className = "expand-button";
            expandButton.style.marginLeft = "-85%";
            expandButton.innerHTML = "<i class='fa fa-chevron-down'></i>";
            expandButton.onclick = function () {
                toggleDetails(expandButton);
            };
            detailsCell.appendChild(expandButton);

            // Set product image
            var productImage = document.createElement("img");
            productImage.src = productData.product_image;
            productImage.style.maxWidth = "100px";
            productImage.style.maxHeight = "100px";
            imageCell.appendChild(productImage);

            // Add edit and delete buttons
            var editButton = document.createElement("button");
            editButton.className = "edit-button";
            editButton.innerHTML = "<i class='fa-regular fa-pen-to-square'></i> Update";
            editButton.onclick = function () { editProduct(productKey); };
            actionsCell.appendChild(editButton);

            var deleteButton = document.createElement("button");
            deleteButton.className = "delete-button";
            deleteButton.innerHTML = "<i class='fa-regular fa-trash-can'></i> Delete";
            deleteButton.onclick = function () { deleteProduct(productKey); };
            actionsCell.appendChild(deleteButton);
        });
    }).catch(function (error) {
        console.error("Error retrieving products: ", error);
    });
}

// Function to toggle details and expand/collapse button
function toggleDetails(button) {
    const detailsWrapper = button.previousElementSibling;
    if (detailsWrapper.style.maxHeight === "none") {
        detailsWrapper.style.maxHeight = "4.5em"; // Collapse
        button.innerHTML = "<i class='fa fa-chevron-down'></i>"; // Arrow downwards
    } else {
        detailsWrapper.style.maxHeight = "none"; // Expand
        button.innerHTML = "<i class='fa fa-chevron-up'></i>"; // Arrow upwards
    }
}

// Call displayProducts() to populate the table when the page loads
window.onload = function () {
    displayProducts();
};



// Function to populate input fields with existing product data when the "Update" button is clicked
function editProduct(productId) {
    firebase.database().ref("product/" + productId).once("value", function (snapshot) {
        var productData = snapshot.val();
        document.getElementById("product_name").value = productData.product_name;
        document.getElementById("product_details").value = productData.product_details.join('\n'); // Join details array into a string
        document.getElementById("product_image_url").value = productData.product_image; // Populate image URL

        // Set variables with existing data
        Productname = productData.product_name;
        Productdetails = productData.product_details;
        Productimage = productData.product_image;

        // Scroll to the input fields
        document.getElementById("product_name").scrollIntoView({ behavior: 'smooth' });
    });
}

// Function to delete product
function deleteProduct(productId) {
    var confirmation = confirm("Are you sure you want to delete this product?");
    if (confirmation) {
        var productRef = firebase.database().ref("product/" + productId);
        productRef.once("value", function (snapshot) {
            var productData = snapshot.val();
            // Remove image from storage
            var imageRef = firebase.storage().refFromURL(productData.product_image);
            imageRef.delete().then(function () {
                // Delete product data from database
                productRef.remove().then(function () {
                    alert("Product deleted successfully");
                    displayProducts(); // Refresh the table
                }).catch(function (error) {
                    alert("Failed to delete product: " + error.message);
                });
            }).catch(function (error) {
                alert("Failed to delete image: " + error.message);
            });
        });
    }
}

// Function to search projects
function searchProducts() {
    var input, filter, table, tr, td, i, txtValue;
    input = document.getElementById("searchInput");
    filter = input.value.toUpperCase();
    table = document.getElementById("products_table");
    tr = table.getElementsByTagName("tr");

    for (i = 1; i < tr.length; i++) {
        td = tr[i].getElementsByTagName("td")[0];
        if (td) {
            txtValue = td.textContent || td.innerText;
            if (txtValue.toUpperCase().indexOf(filter) > -1) {
                tr[i].style.display = "";
            } else {
                tr[i].style.display = "none";
            }
        }
    }
}

// Call displayProducts() to populate the table when the page loads
window.onload = function () {
    displayProducts();
};
















// ADMIN DASHBOARD FOR PROJECTS


// Project management variables
var Projectname, Projectdetails, Projectimage;
var isUpdating = false; // Flag to prevent multiple submissions

// Function to read project form data
function readProjectForm() {
    Projectname = document.getElementById("project_name").value;
    Projectdetails = document.getElementById("project_details").value; // Read details as a single string
    Projectimage = document.getElementById("project_image").files[0];
}

// Function to create or update the project data
document.getElementById("save_project").onclick = async function (event) {
    event.preventDefault(); // Prevent form submission
    if (isUpdating) return; // Prevent multiple submissions
    isUpdating = true;

    readProjectForm();

    // Check if all fields are filled
    if (!Projectname || !Projectdetails.trim()) {
        alert("Name and Details are required");
        isUpdating = false;
        return;
    }

    try {
        // Check if the project already exists
        const snapshot = await firebase.database().ref("project/" + Projectname).once("value");
        if (snapshot.exists()) {
            // Project exists, update it
            if (Projectimage) {
                // Update project with a new image
                await updateProjectWithImage(snapshot.val().project_image);
            } else {
                // Update project without a new image
                await updateProjectDetails(Projectname, Projectdetails);
            }
        } else {
            // Project doesn't exist, add a new one
            if (Projectimage) {
                // Add new project with an image
                await addNewProject();
            } else {
                alert("Image is required for adding a new project");
                isUpdating = false;
            }
        }
    } catch (error) {
        alert("Error: " + error.message);
        isUpdating = false;
    }
};

// Function to update project details with a new image
async function updateProjectWithImage(oldImageUrl) {
    try {
        // Upload new image to Firebase Storage
        var storageRef = firebase.storage().ref();
        var imageRef = storageRef.child('project_images/' + Projectname + '_' + Date.now()); // Unique filename

        await imageRef.put(Projectimage);
        const url = await imageRef.getDownloadURL();

        // Delete the old image
        var oldImageRef = firebase.storage().refFromURL(oldImageUrl);
        await oldImageRef.delete();

        // Update project with new image URL
        await updateProject(Projectname, Projectdetails, url);
    } catch (error) {
        alert("Failed to update project with image: " + error.message);
        isUpdating = false;
    }
}

// Function to add a new project
async function addNewProject() {
    try {
        var storageRef = firebase.storage().ref();
        var imageRef = storageRef.child('project_images/' + Projectname + '_' + Date.now());

        await imageRef.put(Projectimage);
        const url = await imageRef.getDownloadURL();

        await firebase.database().ref("project/" + Projectname).set({
            project_name: Projectname,
            project_details: Projectdetails,
            project_image: url,
            timestamp: firebase.database.ServerValue.TIMESTAMP // Add timestamp here
        });

        alert("Project added successfully");
        clearProjectFormFields();
        displayProjects();
    } catch (error) {
        alert("Failed to add project: " + error.message);
    } finally {
        isUpdating = false;
    }
}
// Function to update project details without uploading a new image
async function updateProjectDetails(name, details) {
    try {
        await firebase.database().ref("project/" + name).update({
            project_name: name,
            project_details: details
        });

        alert("Project updated successfully");
        clearProjectFormFields();
        displayProjects(); // Refresh the table
    } catch (error) {
        alert("Failed to update project: " + error.message);
    } finally {
        isUpdating = false;
    }
}

// Function to update project details with or without a new image
async function updateProject(name, details, imageUrl) {
    try {
        await firebase.database().ref("project/" + name).set({
            project_name: name,
            project_details: details,
            project_image: imageUrl,
            timestamp: firebase.database.ServerValue.TIMESTAMP // Update timestamp here
        });

        alert("Project updated successfully");
        clearProjectFormFields();
        displayProjects();
    } catch (error) {
        alert("Failed to update project: " + error.message);
    } finally {
        isUpdating = false;
    }
}

// Function to clear form fields
function clearProjectFormFields() {
    document.getElementById("project_name").value = "";
    document.getElementById("project_details").value = "";
    document.getElementById("project_image").value = "";
    document.getElementById("project_image_url").value = "";
}

// Function to display projects in a table
function displayProjects() {
    console.log("Displaying projects...");
    var projectsTable = document.getElementById("projects_table").getElementsByTagName('tbody')[0];
    projectsTable.innerHTML = ""; // Clear previous data

    // Retrieve project data from Firebase Realtime Database
    firebase.database().ref("project").once("value", function (snapshot) {
        snapshot.forEach(function (childSnapshot) {
            var projectKey = childSnapshot.key;
            var projectData = childSnapshot.val();

            // Create table row for each project
            var row = projectsTable.insertRow();
            var nameCell = row.insertCell(0);
            var detailsCell = row.insertCell(1);
            var imageCell = row.insertCell(2);
            var actionsCell = row.insertCell(3);

            // Set project name
            nameCell.innerHTML = projectData.project_name;
            nameCell.className = "projects-name-cell";

            // Set project details with expand/collapse button
            var projectDetails = projectData.project_details || ""; // Default to an empty string if details are null or undefined
            var detailsWrapper = document.createElement("div");
            detailsWrapper.className = "details-wrapper collapsed";
            detailsWrapper.style.maxHeight = "4.5em"; // Approx. 3 lines
            detailsWrapper.style.overflow = "hidden";
            detailsWrapper.style.position = "relative";

            var detailsContent = document.createElement("div");
            detailsContent.innerHTML = projectDetails.replace(/\n/g, '<br>'); // Replace newlines with <br> tags
            detailsWrapper.appendChild(detailsContent);

            detailsCell.appendChild(detailsWrapper);
            detailsCell.style.fontSize = "20px";
            detailsCell.style.maxWidth = "240px"; // Set maximum width of details column
            detailsCell.style.wordWrap = "break-word"; // Allow word wrapping

            // Set project image
            imageCell.innerHTML = "<img src='" + projectData.project_image + "' style='max-width: 100px; max-height: 100px;'>";

            // Add expand and collapse button
            var expandButton = document.createElement("button");
            expandButton.className = "expand-button";
            expandButton.innerHTML = "<i class='fa fa-chevron-down'></i>";
            expandButton.onclick = function () {
                toggleDetails(expandButton);
            };
            detailsCell.appendChild(expandButton);

            // Allow style and color to be editable
            expandButton.style.color = projectData.expand_button_color || "#E62B00"; // Default color is red
            expandButton.style.fontSize = projectData.expand_button_size || "20px"; // Default size is 20px

            // Append button to the bottom of details cell
            detailsCell.appendChild(expandButton);

            // Add edit and delete buttons
            actionsCell.innerHTML = "<button class='edit-button' onclick='editProject(\"" + projectKey + "\")'><i class='fa-regular fa-pen-to-square'></i> Update</button> " +
                "<button class='delete-button' onclick='deleteProject(\"" + projectKey + "\")'><i class='fa-regular fa-trash-can'></i> Delete</button>";
        });
    }).catch(function (error) {
        console.error("Error retrieving projects: ", error);
    });
}


// Function to toggle details and expand/collapse button
function toggleDetails(detailsWrapper, expandButton) {
    if (detailsWrapper.style.maxHeight === "none") {
        // Collapse details
        detailsWrapper.style.maxHeight = "4.5em"; // Approx. 3 lines
        expandButton.innerHTML = "<i class='fa fa-chevron-down'></i>"; // Arrow downwards
    } else {
        // Expand details
        detailsWrapper.style.maxHeight = "none";
        expandButton.innerHTML = "<i class='fa fa-chevron-up'></i>"; // Arrow upwards
    }
}






// Function to populate input fields with existing project data when the "Update" button is clicked
function editProject(projectId) {
    firebase.database().ref("project/" + projectId).once("value", function (snapshot) {
        var projectData = snapshot.val();
        document.getElementById("project_name").value = projectData.project_name;
        document.getElementById("project_details").value = projectData.project_details; // Populate details as a single string
        document.getElementById("project_image_url").value = projectData.project_image; // Populate image URL

        // Set variables with existing data
        Projectname = projectData.project_name;
        Projectdetails = projectData.project_details;
        Projectimage = projectData.project_image;

        // Scroll to the input fields
        document.getElementById("project_name").scrollIntoView({ behavior: 'smooth' });
    });
}

// Function to delete project
function deleteProject(projectId) {
    var confirmation = confirm("Are you sure you want to delete this project?");
    if (confirmation) {
        var projectRef = firebase.database().ref("project/" + projectId);
        projectRef.once("value", function (snapshot) {
            var projectData = snapshot.val();
            // Remove image from storage
            var imageRef = firebase.storage().refFromURL(projectData.project_image);
            imageRef.delete().then(function () {
                // Delete project data from database
                projectRef.remove().then(function () {
                    alert("Project deleted successfully");
                    displayProjects(); // Refresh the table
                }).catch(function (error) {
                    alert("Failed to delete project: " + error.message);
                });
            }).catch(function (error) {
                alert("Failed to delete image: " + error.message);
            });
        });
    }
}

// Function to search projects
function searchProjects() {
    var input, filter, table, tr, td, i, txtValue;
    input = document.getElementById("searchProjectInput");
    filter = input.value.toUpperCase();
    table = document.getElementById("projects_table");
    tr = table.getElementsByTagName("tr");

    for (i = 1; i < tr.length; i++) {
        td = tr[i].getElementsByTagName("td")[0];
        if (td) {
            txtValue = td.textContent || td.innerText;
            if (txtValue.toUpperCase().indexOf(filter) > -1) {
                tr[i].style.display = "";
            } else {
                tr[i].style.display = "none";
            }
        }
    }
}

// Call displayProjects() to populate the table when the page loads
window.onload = function () {
    displayProjects();
};

window.onload = function () {
    displayProducts();
    displayProjects();
};
















// Initialize Quill editor
// var jobDescriptionEditor = new Quill('#job_description', {
//     theme: 'snow'
// });

const toolbarOptions = [
    ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
    // ['blockquote', 'code-block'],
    // ['link', 'image', 'video', 'formula'],


    // [{ 'header': 1 }, { 'header': 2 }],               // custom button values
    [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'list': 'check' }],
    // [{ 'script': 'sub' }, { 'script': 'super' }],      // superscript/subscript
    // [{ 'indent': '-1' }, { 'indent': '+1' }],          // outdent/indent
    // [{ 'direction': 'rtl' }],                         // text direction

    // [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

    // [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
    // [{ 'font': [] }],
    // [{ 'align': [] }],

    // ['clean']                                         // remove formatting button
];
const jobDescriptionEditor = new Quill('#job_description', {
    modules: {
        toolbar: toolbarOptions
    },
    theme: 'snow',
});

// Function to get content from Quill editor and prepare data for Firebase
function getCareerFormData() {
    return {
        jobName: document.getElementById('job_name').value,
        educationLevel: document.getElementById('education_level').value,
        jobLocation: document.getElementById('job_location').value,
        jobShift: document.getElementById('job_shift').value,
        positionType: document.getElementById('position_type').value,
        jobCategory: document.getElementById('job_category').value,
        jobDescription: jobDescriptionEditor.root.innerHTML,
        timestamp: firebase.database.ServerValue.TIMESTAMP // Add timestamp
    };
}

// Add event listeners for buttons
document.getElementById('saveCareer').addEventListener('click', saveVacancy);
document.getElementById('clear_form').addEventListener('click', clearForm);

function clearForm() {
    document.getElementById('job_name').value = '';
    document.getElementById('education_level').value = '';
    document.getElementById('job_location').value = '';
    document.getElementById('job_shift').value = '';
    document.getElementById('position_type').value = '';
    document.getElementById('job_category').value = '';
    jobDescriptionEditor.root.innerHTML = '';
}

function validateCareerInput(vacancy) {
    for (const key in vacancy) {
        if (vacancy[key] === '') {
            alert(`${key.replace(/([A-Z])/g, ' $1')} is required.`);
            return false;
        }
    }
    return true;
}


function checkAddNewEducationOption() {
    var select = document.getElementById("education_level");
    var selectedOption = select.options[select.selectedIndex].value;
    if (selectedOption === "add_new") {
        var neweducation = prompt("Please enter the new education level:");
        if (neweducation) {
            var option = document.createElement("option");
            option.text = neweducation;
            option.value = neweducation;
            
            // Insert new option before the "Add New Shift" option
            select.add(option, select.options[select.options.length - 1]);
            select.value = neweducation;
        } else {
            select.value = ""; // Reset to default if no new shift is added
        }
    }
}

// Adjust dropdown width
document.addEventListener('DOMContentLoaded', function() {
    var educationlevelDropdown = document.getElementById('education_level');
    educationlevelDropdown.style.width = '100%';
});


function checkAddNewLocationOption() {
    var select = document.getElementById("job_location");
    var selectedOption = select.options[select.selectedIndex].value;
    if (selectedOption === "add_new_location") {
        var newLocation = prompt("Please enter the new location:");
        if (newLocation) {
            var option = document.createElement("option");
            option.text = newLocation;
            option.value = newLocation;
            
            // Insert new option before the "Add New Shift" option
            select.add(option, select.options[select.options.length - 1]);
            select.value = newLocation;
        } else {
            select.value = ""; // Reset to default if no new shift is added
        }
    }
}

// Adjust dropdown width
document.addEventListener('DOMContentLoaded', function() {
    var locationDropdown = document.getElementById('job_location');
    locationDropdown.style.width = '100%';
});


function checkAddNewPositionOption() {
    var select = document.getElementById("position_type");
    var selectedOption = select.options[select.selectedIndex].value;
    if (selectedOption === "add_new_position") {
        var newposition = prompt("Please enter the new position type:");
        if (newposition) {
            var option = document.createElement("option");
            option.text = newposition;
            option.value = newposition;
            
            // Insert new option before the "Add New Shift" option
            select.add(option, select.options[select.options.length - 1]);
            select.value = newposition;
        } else {
            select.value = ""; // Reset to default if no new shift is added
        }
    }
}

// Adjust dropdown width
document.addEventListener('DOMContentLoaded', function() {
    var positiontypeDropdown = document.getElementById('position_type');
    positiontypeDropdown.style.width = '100%';
});



function checkAddNewShiftOption() {
    var select = document.getElementById("job_shift");
    var selectedOption = select.options[select.selectedIndex].value;
    if (selectedOption === "add_new_shift") {
        var newShift = prompt("Please enter the new shift:");
        if (newShift) {
            var option = document.createElement("option");
            option.text = newShift;
            option.value = newShift;
            
            // Insert new option before the "Add New Shift" option
            select.add(option, select.options[select.options.length - 1]);
            select.value = newShift;
        } else {
            select.value = ""; // Reset to default if no new shift is added
        }
    }
}

// Adjust dropdown width
document.addEventListener('DOMContentLoaded', function() {
    var jobShiftDropdown = document.getElementById('job_shift');
    jobShiftDropdown.style.width = '100%';
});




// Fetch existing job categories
let jobCategories = [];

function fetchJobCategories() {
    firebase.database().ref('vacancies').once('value', (snapshot) => {
        const categories = new Set();
        snapshot.forEach((childSnapshot) => {
            categories.add(childSnapshot.val().jobCategory);  // Keep the original case
        });
        jobCategories = Array.from(categories);
    });
}

// Filter and display suggestions
function showCategorySuggestions() {
    const input = document.getElementById('job_category').value.toLowerCase(); // Convert input to lowercase
    const suggestionsContainer = document.getElementById('categorySuggestions');
    suggestionsContainer.innerHTML = '';

    if (input) {
        const filteredCategories = jobCategories.filter(category => 
            category.toLowerCase().includes(input)  // Convert category to lowercase for comparison
        );
        filteredCategories.forEach(category => {
            const suggestionItem = document.createElement('div');
            suggestionItem.className = 'suggestion-item';
            suggestionItem.innerText = category;
            suggestionItem.onclick = () => selectCategory(category);
            suggestionsContainer.appendChild(suggestionItem);
        });
    }
}

// Select a category from the suggestions
function selectCategory(category) {
    document.getElementById('job_category').value = category;
    document.getElementById('categorySuggestions').innerHTML = '';
}

// Fetch categories on page load
fetchJobCategories();


function fetchVacancies() {
    const vacancyTable = document.getElementById('vacancy_table').getElementsByTagName('tbody')[0];
    firebase.database().ref('vacancies').orderByChild('timestamp').once('value', (snapshot) => {
        vacancyTable.innerHTML = ''; // Clear the table
        const vacancies = [];
        snapshot.forEach((childSnapshot) => {
            vacancies.push({ key: childSnapshot.key, ...childSnapshot.val() });
        });

        // Reverse the array to show the latest vacancy on top
        vacancies.reverse();

        vacancies.forEach((vacancy) => {
            const row = vacancyTable.insertRow();
            row.innerHTML = `
                <td>${vacancy.jobName} <i class="fa fa-edit edit-icon" onclick="editVacancy('${vacancy.key}')"></i> <i class="fa fa-trash delete-icon" onclick="deleteVacancy('${vacancy.key}')"></i></td>
                <td>${vacancy.educationLevel}</td>
                <td>${vacancy.jobLocation}</td>
                <td>${vacancy.jobShift}</td>
                <td>${vacancy.positionType}</td>
                <td>${vacancy.jobCategory}</td>
                <td>
                    <div class="details-wrapper">${vacancy.jobDescription}</div>
                    <button class="expand-button" onclick="showJobDescriptionModal('${vacancy.jobDescription}')">View</button>
                </td>
            `;
        });
    });
}

function showJobDescriptionModal(description) {
    var modal = document.getElementById('jobDescriptionModal');
    var modalContent = document.getElementById('modalJobDescription');
    modalContent.innerHTML = description;
    modal.style.display = "block";
}

// Close the modal
var modal = document.getElementById('jobDescriptionModal');
var span = document.getElementsByClassName('close')[0];
span.onclick = function() {
    modal.style.display = "none";
}
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

fetchVacancies();

function toggleDetails(button) {
    const detailsWrapper = button.previousElementSibling;
    if (detailsWrapper.style.maxHeight === 'none') {
        detailsWrapper.style.maxHeight = '5.5em'; // Approx. 3 lines
        button.innerHTML = "<i class='fa fa-chevron-down'></i>"; // Arrow downwards
    } else {
        detailsWrapper.style.maxHeight = 'none';
        button.innerHTML = "<i class='fa fa-chevron-up'></i>"; // Arrow upwards
    }
}

function editVacancy(key) {
    firebase.database().ref('vacancies/' + key).once('value').then((snapshot) => {
        const vacancy = snapshot.val();
        document.getElementById('job_name').value = vacancy.jobName;
        document.getElementById('education_level').value = vacancy.educationLevel;
        document.getElementById('job_location').value = vacancy.jobLocation;
        document.getElementById('job_shift').value = vacancy.jobShift;
        document.getElementById('position_type').value = vacancy.positionType;
        document.getElementById('job_category').value = vacancy.jobCategory;
        jobDescriptionEditor.root.innerHTML = vacancy.jobDescription;
        document.getElementById('saveCareer').dataset.key = key; // Store key in the button's dataset
    });
}

function saveVacancy() {
    const vacancy = getCareerFormData();
    const key = document.getElementById('saveCareer').dataset.key;

    if (!validateCareerInput(vacancy)) {
        return;
    }

    if (key) {
        // Update existing vacancy
        firebase.database().ref('vacancies/' + key).update(vacancy, (error) => {
            if (error) {
                alert('Error updating vacancy: ' + error.message);
            } else {
                alert('Vacancy updated successfully!');
                fetchVacancies();
                clearForm();
                document.getElementById('saveCareer').removeAttribute('data-key'); // Clear key from dataset
            }
        });
    } else {
        // Add new vacancy
        firebase.database().ref('vacancies').push(vacancy, (error) => {
            if (error) {
                alert('Error adding vacancy: ' + error.message);
            } else {
                alert('Vacancy added successfully!');
                fetchVacancies();
                clearForm();
            }
        });
    }
}

function deleteVacancy(key) {
    if (confirm('Are you sure you want to delete this vacancy?')) {
        firebase.database().ref('vacancies/' + key).remove((error) => {
            if (error) {
                alert('Error deleting vacancy: ' + error.message);
            } else {
                alert('Vacancy deleted successfully!');
                fetchVacancies();
            }
        });
    }
}

// Function to search vacancies
function searchVacancies() {
    var input, filter, table, tr, td, i, txtValue;
    input = document.getElementById("searchInput"); // Get the search input element
    filter = input.value.toUpperCase(); // Convert input value to uppercase for case-insensitive comparison
    table = document.getElementById("vacancy_table"); // Reference the correct table by ID
    tr = table.getElementsByTagName("tr"); // Get all rows in the table

    // Loop through all table rows, starting from the second row (skipping the header)
    for (i = 1; i < tr.length; i++) {
        td = tr[i].getElementsByTagName("td")[0]; // Get the first cell in the row (Job Name)
        if (td) {
            txtValue = td.textContent || td.innerText; // Get the text content of the cell
            // Check if the text value matches the filter
            if (txtValue.toUpperCase().indexOf(filter) > -1) {
                tr[i].style.display = ""; // Show the row if it matches the filter
            } else {
                tr[i].style.display = "none"; // Hide the row if it does not match the filter
            }
        }
    }
}

// Initial fetch of vacancies
fetchVacancies();

document.addEventListener('DOMContentLoaded', () => {
    enableTableDragScroll();
  });
  
  function enableTableDragScroll() {
    const tableContainer = document.querySelector('.admin_career_table');
    let isDragging = false;
    let startX;
    let scrollLeft;
  
    tableContainer.addEventListener('mousedown', (e) => {
      isDragging = true;
      startX = e.pageX - tableContainer.offsetLeft;
      scrollLeft = tableContainer.scrollLeft;
    });
  
    tableContainer.addEventListener('mouseleave', () => {
      isDragging = false;
    });
  
    tableContainer.addEventListener('mouseup', () => {
      isDragging = false;
    });
  
    tableContainer.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      e.preventDefault();
      const x = e.pageX - tableContainer.offsetLeft;
      const walk = (x - startX) * 2; // Multiply the walk distance to scroll faster
      tableContainer.scrollLeft = scrollLeft - walk;
    });
  }
  











  

// ********************************************************************************************
// Function to create the pending reviews table
// ********************************************************************************************
document.addEventListener("DOMContentLoaded", function () {
    // Function to create the pending reviews table
    function createPendingReviewsTable(snapshot) {
        var tableDiv = document.querySelector(".pending_reviews_table_area");
        tableDiv.innerHTML = "";

        var table = document.createElement("table");
        table.classList.add("pending_reviews_table");

        var thead = document.createElement("thead");
        var headerRow = document.createElement("tr");
        headerRow.innerHTML = "<th>Name</th><th>Email</th><th>Message</th><th>Action</th>";
        thead.appendChild(headerRow);
        table.appendChild(thead);

        var tbody = document.createElement("tbody");

        snapshot.forEach(function (childSnapshot) {
            var reviewData = childSnapshot.val();
            var reviewKey = childSnapshot.key; // Get the key of the current pending review
            var row = document.createElement("tr");
            row.innerHTML = "<td>" + reviewData.name + "</td>" +
                "<td>" + reviewData.email + "</td>" +
                "<td>" + reviewData.message + "</td>" +
                "<td class='actionColumn'><button style='margin-right:5px;' class='approve_btn'> Approve</i></button>" +
                "<button class='delete_btn'><i class='fa-solid fa-trash-can'></i>&nbsp; Delete</button></td>";

            // Add event listener to the approve button
            var approveBtn = row.querySelector(".approve_btn");
            approveBtn.addEventListener("click", function () {
                approveReview(reviewKey, reviewData);
            });

            // Add event listener to the delete button
            var deleteBtn = row.querySelector(".delete_btn");
            deleteBtn.addEventListener("click", function () {
                deleteReview(reviewKey);
            });

            tbody.appendChild(row);
        });

        table.appendChild(tbody);
        tableDiv.appendChild(table);
    }

    // Function to refresh pending reviews table data
    function refreshPendingReviewsTable() {
        var pendingReviewsRef = firebase.database().ref("PendingReviews");
        pendingReviewsRef.once("value", function (snapshot) {
            createPendingReviewsTable(snapshot);
        });
    }

    // Function to approve a review
    function approveReview(reviewKey, reviewData) {
        // Get a reference to the Firebase database
        var database = firebase.database();

        // Get a reference to the "ApprovedReviews" collection
        var approvedReviewsRef = database.ref("approvedReviews");

        // Set the review data with the "name" key's value as the key for the object
        var updatedReviewData = {};
        updatedReviewData[reviewData.name] = reviewData;

        // Add the updated review data to the "ApprovedReviews" collection
        approvedReviewsRef.update(updatedReviewData)
            .then(function () {
                // If adding to "ApprovedReviews" succeeds, remove the review from "PendingReviews"
                var pendingReviewsRef = database.ref("PendingReviews/" + reviewKey);
                pendingReviewsRef.remove()
                    .then(function () {
                        // If removal from "PendingReviews" succeeds, refresh the pending reviews table
                        refreshPendingReviewsTable();
                    })
                    .catch(function (error) {
                        console.error("Error removing review from PendingReviews:", error);
                    });
            })
            .catch(function (error) {
                console.error("Error adding review to ApprovedReviews:", error);
            });
    }

    // Function to delete a review
    function deleteReview(reviewKey) {
        // Get a reference to the Firebase database
        var database = firebase.database();

        // Get a reference to the "PendingReviews" collection
        var pendingReviewsRef = database.ref("PendingReviews/" + reviewKey);

        // Remove the review from the "PendingReviews" collection
        pendingReviewsRef.remove()
            .then(function () {
                // If removal succeeds, refresh the pending reviews table
                refreshPendingReviewsTable();
            })
            .catch(function (error) {
                console.error("Error removing review from PendingReviews:", error);
            });
    }

    // Call the function to display pending reviews when the page is loaded
    refreshPendingReviewsTable();
});




// Call the function to display pending reviews when the page is loaded
document.addEventListener("DOMContentLoaded", function () {
    refreshPendingReviewsTable();
});








//************************************************* */
// Function to create the approved reviews table
//************************************************* */

// Function to create the approved reviews table
function createApprovedReviewsTable(snapshot) {
    var tableDiv = document.querySelector(".approved_reviews_table_area");
    tableDiv.innerHTML = "";

    var table = document.createElement("table");
    table.classList.add("approved_reviews_table");

    var thead = document.createElement("thead");
    var headerRow = document.createElement("tr");
    headerRow.innerHTML = "<th>Name</th><th>Email</th><th>Message</th><th>Action</th>";
    thead.appendChild(headerRow);
    table.appendChild(thead);

    var tbody = document.createElement("tbody");

    snapshot.forEach(function (childSnapshot) {
        var reviewData = childSnapshot.val();
        var reviewKey = childSnapshot.key; // Get the key of the current approved review
        var row = document.createElement("tr");
        row.innerHTML = "<td>" + reviewData.name + "</td>" +
            "<td>" + reviewData.email + "</td>" +
            "<td>" + reviewData.message + "</td>" +
            "<td class='actionColumn'><button class='delete_btn'><i class='fa-solid fa-trash-can'></i>&nbsp; Delete</button></td>";

        // Add event listener to the delete button
        var deleteBtn = row.querySelector(".delete_btn");
        deleteBtn.addEventListener("click", function () {
            deleteReview(reviewKey);
        });

        tbody.appendChild(row);
    });

    table.appendChild(tbody);
    tableDiv.appendChild(table);
}

// Function to refresh approved reviews table data
function refreshApprovedReviewsTable() {
    var approvedReviewsRef = firebase.database().ref("approvedReviews");
    approvedReviewsRef.once("value", function (snapshot) {
        createApprovedReviewsTable(snapshot);
    });
}

// Function to delete a review
function deleteReview(reviewKey) {
    // Get a reference to the Firebase database
    var database = firebase.database();

    // Get a reference to the "ApprovedReviews" collection
    var approvedReviewsRef = database.ref("approvedReviews/" + reviewKey);

    // Remove the review from the "ApprovedReviews" collection
    approvedReviewsRef.remove()
        .then(function () {
            // If removal succeeds, refresh the approved reviews table
            refreshApprovedReviewsTable();
        })
        .catch(function (error) {
            console.error("Error removing review from ApprovedReviews:", error);
        });
}

// Call the function to display approved reviews when the page is loaded
document.addEventListener("DOMContentLoaded", function () {
    refreshApprovedReviewsTable();
});


// ********************************************************************************************
// testimonials toggle switch
// ********************************************************************************************
document.querySelector('.reviewTogglerPending').style.backgroundColor = 'var(--theme_color1)';
document.querySelector('.reviewTogglerApproved').style.backgroundColor = '#ff2f0083';


function showPendingReviews() {
    document.querySelector('.pending_reviews_table_area').style.display = 'block';
    document.querySelector('.approved_reviews_table_area').style.display = 'none';

    document.querySelector('.reviewTogglerPending').style.backgroundColor = 'var(--theme_color1)';
    document.querySelector('.reviewTogglerApproved').style.backgroundColor = '#ff2f0083';
}

function showApprovedReviews() {
    document.querySelector('.pending_reviews_table_area').style.display = 'none';
    document.querySelector('.approved_reviews_table_area').style.display = 'block';

    document.querySelector('.reviewTogglerPending').style.backgroundColor = '#ff2f0083';
    document.querySelector('.reviewTogglerApproved').style.backgroundColor = 'var(--theme_color1)';
}