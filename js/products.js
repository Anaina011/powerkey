const productsPerPage = 9;
let currentPage = 1;
let totalPages = 1;
let allProducts = []; // Store all products here to allow searching

function displayProducts() {
    var productCardsContainer = document.getElementById("product_cards");

    // Retrieve product data from Firebase Realtime Database
    firebase.database().ref("product").once("value", function (snapshot) {
        allProducts = [];
        snapshot.forEach(function (childSnapshot) {
            allProducts.push(childSnapshot.val());
        });

        totalPages = Math.ceil(allProducts.length / productsPerPage);
        displayPage(allProducts, currentPage);
        setupPagination(allProducts);
    });
}

function displayPage(products, page) {
    var productCardsContainer = document.getElementById("product_cards");
    productCardsContainer.innerHTML = "";

    const startIndex = (page - 1) * productsPerPage;
    const endIndex = Math.min(startIndex + productsPerPage, products.length);

    for (let i = startIndex; i < endIndex; i++) {
        const productData = products[i];
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
        hoverArrowWrapper.appendChild(hoverArrow);
        hoverContactButton.appendChild(hoverArrowWrapper);
        hoverContactButtonAnchor.appendChild(hoverContactButton);
        hoverContactButtonDiv.appendChild(hoverContactButtonAnchor);
        detailsContainer.appendChild(hoverContactButtonDiv);

        card.appendChild(detailsContainer);

        // Append card to product cards container
        productCardsContainer.appendChild(card);
    }
}

function setupPagination(products) {
    const paginationContainer = document.getElementById("pagination");
    paginationContainer.innerHTML = "";

    const pagination = document.createElement("div");
    pagination.className = "pagination";

    const prev = document.createElement("a");
    prev.innerHTML = "&laquo;";
    prev.addEventListener("click", function () {
        if (currentPage > 1) {
            currentPage--;
            displayPage(products, currentPage);
            setupPagination(products);
        }
    });
    pagination.appendChild(prev);

    for (let i = 1; i <= totalPages; i++) {
        const page = document.createElement("a");
        page.textContent = i;
        if (i === currentPage) {
            page.className = "active";
        }
        page.addEventListener("click", function () {
            currentPage = i;
            displayPage(products, currentPage);
            setupPagination(products);
        });
        pagination.appendChild(page);
    }

    const next = document.createElement("a");
    next.innerHTML = "&raquo;";
    next.addEventListener("click", function () {
        if (currentPage < totalPages) {
            currentPage++;
            displayPage(products, currentPage);
            setupPagination(products);
        }
    });
    pagination.appendChild(next);

    paginationContainer.appendChild(pagination);
}

function searchProducts() {
    const input = document.getElementById('searchInput').value.toLowerCase();
    const filteredProducts = allProducts.filter(product => product.product_name.toLowerCase().includes(input));
    currentPage = 1; // Reset to the first page
    displayPage(filteredProducts, currentPage);
    setupPaginationForSearch(filteredProducts);
}

function setupPaginationForSearch(products) {
    const paginationContainer = document.getElementById("pagination");
    paginationContainer.innerHTML = "";

    if (products.length <= productsPerPage) {
        return; // No pagination needed if all products fit on one page
    }

    const pagination = document.createElement("div");
    pagination.className = "pagination";

    const prev = document.createElement("a");
    prev.innerHTML = "&laquo;";
    prev.addEventListener("click", function () {
        if (currentPage > 1) {
            currentPage--;
            displayPage(products, currentPage);
            setupPaginationForSearch(products);
        }
    });
    pagination.appendChild(prev);

    for (let i = 1; i <= totalPages; i++) {
        const page = document.createElement("a");
        page.textContent = i;
        if (i === currentPage) {
            page.className = "active";
        }
        page.addEventListener("click", function () {
            currentPage = i;
            displayPage(products, currentPage);
            setupPaginationForSearch(products);
        });
        pagination.appendChild(page);
    }

    const next = document.createElement("a");
    next.innerHTML = "&raquo;";
    next.addEventListener("click", function () {
        if (currentPage < totalPages) {
            currentPage++;
            displayPage(products, currentPage);
            setupPaginationForSearch(products);
        }
    });
    pagination.appendChild(next);

    paginationContainer.appendChild(pagination);
}

// Call displayProducts() to populate the cards when the page loads
window.onload = function () {
    displayProducts();
};
