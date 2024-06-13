function displayProducts() {
    var productCardsContainer = document.getElementById("product_cards");

    // Retrieve product data from Firebase Realtime Database
    firebase.database().ref("product").once("value", function (snapshot) {
        snapshot.forEach(function (childSnapshot) {
            var productData = childSnapshot.val();

            // Create card element
            var card = document.createElement("div");
            card.className = "card";

            // Image
            var image = document.createElement("img");
            image.src = productData.product_image;
            card.appendChild(image);

            // Product name and contact button container
            var nameContactContainer = document.createElement("div");
            nameContactContainer.className = "name-contact-container";

            // Product name
            var productName = document.createElement("div");
            productName.className = "product-name";
            productName.textContent = productData.product_name;
            nameContactContainer.appendChild(productName);

            // Contact Us button
            var contactButtonDiv = document.createElement("div");
            contactButtonDiv.className = "home-slide-button1";
            var contactButtonAnchor = document.createElement("a");
            contactButtonAnchor.href = "contact.html";
            var contactButton = document.createElement("button");
            contactButton.textContent = "CONTACT US";
            var arrowWrapper = document.createElement("div");
            arrowWrapper.className = "arrow-wrapper";
            var arrow = document.createElement("div");
            arrow.className = "arrow";
            arrowWrapper.appendChild(arrow);
            contactButton.appendChild(arrowWrapper);
            contactButtonAnchor.appendChild(contactButton);
            contactButtonDiv.appendChild(contactButtonAnchor);
            nameContactContainer.appendChild(contactButtonDiv);

            card.appendChild(nameContactContainer);

        // Details (hidden by default)
        var detailsContainer = document.createElement("div");
        detailsContainer.className = "card-details";
        var details = document.createElement("ul"); // Use ul for list items
        productData.product_details.forEach(function (detail) {
            var detailItem = document.createElement("li");
            detailItem.textContent = detail;
            details.appendChild(detailItem);
        });
        detailsContainer.appendChild(details);
        card.appendChild(detailsContainer);

            // Add product name to hover content
            var hoverProductName = document.createElement("div");
            hoverProductName.className = "product-name";
            hoverProductName.textContent = productData.product_name;
            detailsContainer.insertBefore(hoverProductName, detailsContainer.firstChild);

            // Add contact button to hover content
            var hoverContactButtonDiv = document.createElement("div");
            hoverContactButtonDiv.className = "home-slide-button1";
            var hoverContactButtonAnchor = document.createElement("a");
            hoverContactButtonAnchor.href = "contact.html";
            var hoverContactButton = document.createElement("button");
            hoverContactButton.textContent = "CONTACT US";
            var hoverArrowWrapper = document.createElement("div");
            hoverArrowWrapper.className = "arrow-wrapper";
            var hoverArrow = document.createElement("div");
            hoverArrow.className = "arrow";
            hoverArrowWrapper.appendChild(hoverArrow);
            hoverContactButton.appendChild(hoverArrowWrapper);
            hoverContactButtonAnchor.appendChild(hoverContactButton);
            hoverContactButtonDiv.appendChild(hoverContactButtonAnchor);
            detailsContainer.appendChild(hoverContactButtonDiv);

            card.appendChild(detailsContainer);

     // Append card to product cards container
            productCardsContainer.appendChild(card);
        });
          initializeSlickCarousel();
    });
}

// Call displayProducts() to populate the cards when the page loads
window.onload = function () {
    displayProducts();
};
