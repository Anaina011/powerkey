async function displaysolutionss() {
    const solutionsContainer = document.getElementById("solutions-container");

    // Clear existing solutionss
    solutionsContainer.innerHTML = "";

    try {
        const snapshot = await firebase.database().ref("solutions").orderByChild("timestamp").once("value");
        if (!snapshot.exists()) {
            console.log("No solutionss found.");
            return;
        }

        const solutionss = [];
        snapshot.forEach(function(childSnapshot) {
            solutionss.push(childSnapshot.val());
        });

        // Reverse the order to display the latest solutionss first
        solutionss.reverse();

        solutionss.forEach(function(solutionsData) {
            const solutionsCard = document.createElement("div");
            solutionsCard.className = "solutions-card";

            const solutionsImageContainer = document.createElement("div");
            solutionsImageContainer.className = "solutions-image-container";

            const solutionsImage = document.createElement("img");
            solutionsImage.src = solutionsData.solutions_image;
            solutionsImage.className = "solutions-image";
            solutionsImage.alt = solutionsData.solutions_name;

            const solutionsContent = document.createElement("div");
            solutionsContent.className = "solutions-content";

            const solutionsName = document.createElement("div");
            solutionsName.className = "solutions-name";
            solutionsName.innerText = solutionsData.solutions_name;

            const solutionsDetails = document.createElement("div");
            solutionsDetails.className = "solutions-details";
            solutionsDetails.innerText = solutionsData.solutions_description;

            solutionsContent.appendChild(solutionsName);
            solutionsContent.appendChild(solutionsDetails);

            solutionsCard.appendChild(solutionsImageContainer);
            solutionsCard.appendChild(solutionsContent);

            solutionsImageContainer.appendChild(solutionsImage);

            solutionsContainer.appendChild(solutionsCard);
        });
    } catch (error) {
        console.error("Error retrieving solutionss: ", error);
    }
}

// Call displaysolutionss() to populate the page when the page loads
window.onload = function() {
    displaysolutionss();
};
