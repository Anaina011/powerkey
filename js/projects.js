async function displayProjects() {
    const projectContainer = document.getElementById("project-container");

    // Clear existing projects
    projectContainer.innerHTML = "";

    try {
        const snapshot = await firebase.database().ref("project").orderByChild("timestamp").once("value");
        if (!snapshot.exists()) {
            console.log("No projects found.");
            return;
        }

        const projects = [];
        snapshot.forEach(function(childSnapshot) {
            projects.push(childSnapshot.val());
        });

        // Reverse the order to display the latest projects first
        projects.reverse();

        projects.forEach(function(projectData) {
            const projectCard = document.createElement("div");
            projectCard.className = "project-card";

            const projectImage = document.createElement("img");
            projectImage.src = projectData.project_image;
            projectImage.className = "project-image";
            projectImage.alt = projectData.project_name;

            const projectContent = document.createElement("div");
            projectContent.className = "project-content";

            const projectName = document.createElement("div");
            projectName.className = "project-name";
            projectName.innerText = projectData.project_name;

            const projectDetails = document.createElement("div");
            projectDetails.className = "project-details";
            projectDetails.innerText = projectData.project_details;

            projectContent.appendChild(projectName);
            projectContent.appendChild(projectDetails);

            projectCard.appendChild(projectImage);
            projectCard.appendChild(projectContent);

            projectContainer.appendChild(projectCard);
        });
    } catch (error) {
        console.error("Error retrieving projects: ", error);
    }
}

// Call displayProjects() to populate the page when the page loads
window.onload = function() {
    displayProjects();
};
