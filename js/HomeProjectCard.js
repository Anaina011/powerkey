// Function to fetch and display the latest 4 projects on the home page
async function displayLatestProjects() {
    const projectContainer = document.querySelector(".home_service_project");

    // Clear existing projects
    projectContainer.innerHTML = "";

    try {
        const snapshot = await firebase.database().ref("project").orderByChild('timestamp').limitToLast(4).once("value");
        if (!snapshot.exists()) {
            console.log("No projects found.");
            return;
        }

        // Create an array to hold the project data
        const projects = [];
        snapshot.forEach(function(childSnapshot) {
            projects.push(childSnapshot.val());
        });

        // Reverse the projects array to display the most recent projects first
        projects.reverse();

        projects.forEach(function(projectData) {
            const projectCard = document.createElement("div");
            projectCard.className = "project_card";

            const projectImageContainer = document.createElement("div");
            projectImageContainer.className = "project_card_img";
            const projectImage = document.createElement("img");
            projectImage.src = projectData.project_image;
            projectImage.alt = projectData.project_name;
            projectImageContainer.appendChild(projectImage);

            const projectBlackBg = document.createElement("div");
            projectBlackBg.className = "project_card_black_bg";

            const projectTextContainer = document.createElement("div");
            projectTextContainer.className = "project_card_text_container";
            const projectLiner = document.createElement("div");
            projectLiner.className = "project_card_liner";
            const projectLine = document.createElement("div");
            projectLine.className = "project_card_line";
            projectLiner.appendChild(projectLine);

            const projectText = document.createElement("div");
            projectText.className = "project_card_text";
            const projectName = document.createElement("h6");
            projectName.innerText = projectData.project_name;
            projectText.appendChild(projectName);

            projectTextContainer.appendChild(projectLiner);
            projectTextContainer.appendChild(projectText);

            projectCard.appendChild(projectImageContainer);
            projectCard.appendChild(projectBlackBg);
            projectCard.appendChild(projectTextContainer);

            projectContainer.appendChild(projectCard);
        });

        // Reinitialize the slick carousel after adding new elements
        $('.home_service_project').slick('unslick'); // Destroy the previous slick instance
        $('.home_service_project').slick({
            infinite: false,
            slidesToShow: 4,
            slidesToScroll: 1,
            arrows: false,
            responsive: [
                {
                    breakpoint: 1200,
                    settings: {
                        slidesToShow: 2.5,
                        slidesToScroll: 1
                    }
                },
                {
                    breakpoint: 768,
                    settings: {
                        slidesToShow: 2.3,
                        slidesToScroll: 1
                    }
                },
                {
                    breakpoint: 500,
                    settings: {
                        slidesToShow: 1.3,
                        slidesToScroll: 1
                    }
                }
            ]
        });

    } catch (error) {
        console.error("Error retrieving projects: ", error);
    }
}

// Call displayLatestProjects() to populate the home page when the page loads
window.onload = function() {
    displayLatestProjects();
};
