






let currentPage = 1;
const productsPerPage = 9;
let allProducts = {};

function displayPage(products, page) {
    const container = document.getElementById("product-container");
    container.innerHTML = ""; // Clear previous data

    let productKeys = Object.keys(products);
    let start = (page - 1) * productsPerPage;
    let end = start + productsPerPage;
    let pageProducts = productKeys.slice(start, end);

    let rows = Math.ceil(pageProducts.length / 3);

    for (let i = 0; i < rows; i++) {
        let row = document.createElement("div");
        row.className = "product-row";
        row.id = `row-${i}`;

        let rowStart = i * 3;
        let rowEnd = rowStart + 3;
        let productSlice = pageProducts.slice(rowStart, rowEnd);

        productSlice.forEach(key => {
            const product = products[key];
            const card = document.createElement("div");
            card.className = "product-card";
            card.innerHTML = `
                <img src="${product.product_image}" class="product-image">
                <div class="product-info">
                    <div class="product-name">${product.product_name}</div>
                    <div class="home-slide-button1 contact-button">
                        <a href="contact.html">
                            <button>
                                Contact Us <div class="arrow-wrapper"><div class="arrow"></div></div>
                            </button>
                        </a>
                    </div>
                </div>
                <div class="hidden-product-info">
                    <div class="product-name">${product.product_name}</div>
                    <ul class="product-details">${product.product_details.map(detail => `<li>${detail}</li>`).join('')}</ul>
                    <div class="home-slide-button1 contact-button">
                        <a href="contact.html">
                            <button>
                                Contact Us <div class="arrow-wrapper"><div class="arrow"></div></div>
                            </button>
                        </a>
                    </div>
                </div>
            `;
            row.appendChild(card);
        });

        container.appendChild(row);

        // Initialize Slick Carousel for the row
        $(`#row-${i}`).slick({
            infinite: false,
            slidesToShow: 3,
            slidesToScroll: 3,
            dots: false, // Disable dots
            responsive: [
                {
                    breakpoint: 1024,
                    settings: {
                        slidesToShow: 2.5,
                        slidesToScroll: 2,
                        arrows: false,
                        dots: false
                    }
                },
                {
                    breakpoint: 768,
                    settings: {
                        slidesToShow: 1.5,
                        slidesToScroll: 1,
                        arrows: false,
                        dots: false
                    }
                },
                {
                    breakpoint: 550,
                    settings: {
                        slidesToShow: 1.2,
                        slidesToScroll: 1,
                        arrows: false,
                        dots: false
                    }
                },
                {
                    breakpoint: 380,
                    settings: {
                        slidesToShow: 1.1,
                        slidesToScroll: 1,
                        arrows: false,
                        dots: false
                    }
                }
            ]
        });
    }
}

function fetchAndDisplayProducts() {
    const db = firebase.database().ref("product");

    db.once("value", (snapshot) => {
        allProducts = snapshot.val();
        displayPage(allProducts, currentPage);
        createPaginationControls(allProducts);
    }).catch(error => {
        console.error("Error fetching products: ", error);
    });
}

function createPaginationControls(products) {
    const totalPages = Math.ceil(Object.keys(products).length / productsPerPage);
    const paginationContainer = document.getElementById("pagination-container");
    paginationContainer.innerHTML = ""; // Clear previous pagination controls

    // Previous button
    const prevButton = document.createElement("button");
    prevButton.className = "pagination-button";
    prevButton.textContent = "«";
    prevButton.onclick = () => {
        if (currentPage > 1) {
            currentPage--;
            displayPage(products, currentPage);
            document.getElementById("product-container").scrollIntoView({ behavior: 'smooth' }); // Scroll to the first product row
            updateActivePage();
        }
    };
    paginationContainer.appendChild(prevButton);

    for (let i = 1; i <= totalPages; i++) {
        const pageButton = document.createElement("button");
        pageButton.className = "pagination-button";
        pageButton.textContent = i;
        pageButton.onclick = () => {
            currentPage = i;
            displayPage(products, currentPage);
            document.getElementById("product-container").scrollIntoView({ behavior: 'smooth' }); // Scroll to the first product row
            updateActivePage();
        };
        paginationContainer.appendChild(pageButton);
    }

    // Next button
    const nextButton = document.createElement("button");
    nextButton.className = "pagination-button";
    nextButton.textContent = "»";
    nextButton.onclick = () => {
        if (currentPage < totalPages) {
            currentPage++;
            displayPage(products, currentPage);
            document.getElementById("product-container").scrollIntoView({ behavior: 'smooth' }); // Scroll to the first product row
            updateActivePage();
        }
    };
    paginationContainer.appendChild(nextButton);

    updateActivePage();
}

function updateActivePage() {
    const paginationButtons = document.querySelectorAll(".pagination-button");
    paginationButtons.forEach(button => {
        button.classList.remove("active");
        if (parseInt(button.textContent) === currentPage) {
            button.classList.add("active");
        }
    });
}

function searchProducts() {
    const searchInput = document.getElementById("searchInput").value.toLowerCase();
    const filteredProducts = Object.keys(allProducts).filter(key => {
        return allProducts[key].product_name.toLowerCase().includes(searchInput);
    }).reduce((result, key) => {
        result[key] = allProducts[key];
        return result;
    }, {});
    currentPage = 1; // Reset to first page
    displayPage(filteredProducts, currentPage);
    createPaginationControls(filteredProducts);
}

// Call the function on page load
window.onload = fetchAndDisplayProducts;















//  product card with slick

// const productsPerPage = 9;
// let currentPage = 1;
// let totalPages = 1;
// let allProducts = []; // Store all products here to allow searching

// function displayProducts() {
//     var productCardsContainer = document.getElementById("product_cards");

//     // Retrieve product data from Firebase Realtime Database
//     firebase.database().ref("product").once("value", function (snapshot) {
//         allProducts = [];
//         snapshot.forEach(function (childSnapshot) {
//             allProducts.push(childSnapshot.val());
//         });

//         totalPages = Math.ceil(allProducts.length / productsPerPage);
//         displayPage(allProducts, currentPage);
//         setupPagination(allProducts);
//     });
// }

// function displayPage(products, page) {
//     var productCardsContainer = document.getElementById("product_cards");
//     productCardsContainer.innerHTML = "";

//     const startIndex = (page - 1) * productsPerPage;
//     const endIndex = Math.min(startIndex + productsPerPage, products.length);

//     for (let i = startIndex; i < endIndex; i++) {
//         const productData = products[i];
//         // Create card element
//         var card = document.createElement("div");
//         card.className = "card";

//         // Image
//         var image = document.createElement("img");
//         image.src = productData.product_image;
//         card.appendChild(image);

//         // Product name and contact button container
//         var nameContactContainer = document.createElement("div");
//         nameContactContainer.className = "name-contact-container";

//         // Product name
//         var productName = document.createElement("div");
//         productName.className = "product-name";
//         productName.textContent = productData.product_name;
//         nameContactContainer.appendChild(productName);

//         // Contact Us button
//         var contactButtonDiv = document.createElement("div");
//         contactButtonDiv.className = "home-slide-button1";
//         var contactButtonAnchor = document.createElement("a");
//         contactButtonAnchor.href = "contact.html";
//         var contactButton = document.createElement("button");
//         contactButton.textContent = "CONTACT US";
//         var arrowWrapper = document.createElement("div");
//         arrowWrapper.className = "arrow-wrapper";
//         var arrow = document.createElement("div");
//         arrowWrapper.appendChild(arrow);
//         contactButton.appendChild(arrowWrapper);
//         contactButtonAnchor.appendChild(contactButton);
//         contactButtonDiv.appendChild(contactButtonAnchor);
//         nameContactContainer.appendChild(contactButtonDiv);

//         card.appendChild(nameContactContainer);

//         // Details (hidden by default)
//         var detailsContainer = document.createElement("div");
//         detailsContainer.className = "card-details";
//         var details = document.createElement("ul"); // Use ul for list items
//         productData.product_details.forEach(function (detail) {
//             var detailItem = document.createElement("li");
//             detailItem.textContent = detail;
//             details.appendChild(detailItem);
//         });
//         detailsContainer.appendChild(details);
//         card.appendChild(detailsContainer);

//         // Add product name to hover content
//         var hoverProductName = document.createElement("div");
//         hoverProductName.className = "product-name";
//         hoverProductName.textContent = productData.product_name;
//         detailsContainer.insertBefore(hoverProductName, detailsContainer.firstChild);

//         // Add contact button to hover content
//         var hoverContactButtonDiv = document.createElement("div");
//         hoverContactButtonDiv.className = "home-slide-button1";
//         var hoverContactButtonAnchor = document.createElement("a");
//         hoverContactButtonAnchor.href = "contact.html";
//         var hoverContactButton = document.createElement("button");
//         hoverContactButton.textContent = "CONTACT US";
//         var hoverArrowWrapper = document.createElement("div");
//         hoverArrowWrapper.className = "arrow-wrapper";
//         var hoverArrow = document.createElement("div");
//         hoverArrowWrapper.appendChild(hoverArrow);
//         hoverContactButton.appendChild(hoverArrowWrapper);
//         hoverContactButtonAnchor.appendChild(hoverContactButton);
//         hoverContactButtonDiv.appendChild(hoverContactButtonAnchor);
//         detailsContainer.appendChild(hoverContactButtonDiv);

//         card.appendChild(detailsContainer);

//         // Append card to product cards container
//         productCardsContainer.appendChild(card);
//     }
// }

// function setupPagination(products) {
//     const paginationContainer = document.getElementById("pagination");
//     paginationContainer.innerHTML = "";

//     const pagination = document.createElement("div");
//     pagination.className = "pagination";

//     const prev = document.createElement("a");
//     prev.innerHTML = "&laquo;";
//     prev.addEventListener("click", function () {
//         if (currentPage > 1) {
//             currentPage--;
//             displayPage(products, currentPage);
//             setupPagination(products);
//         }
//     });
//     pagination.appendChild(prev);

//     for (let i = 1; i <= totalPages; i++) {
//         const page = document.createElement("a");
//         page.textContent = i;
//         if (i === currentPage) {
//             page.className = "active";
//         }
//         page.addEventListener("click", function () {
//             currentPage = i;
//             displayPage(products, currentPage);
//             setupPagination(products);
//         });
//         pagination.appendChild(page);
//     }

//     const next = document.createElement("a");
//     next.innerHTML = "&raquo;";
//     next.addEventListener("click", function () {
//         if (currentPage < totalPages) {
//             currentPage++;
//             displayPage(products, currentPage);
//             setupPagination(products);
//         }
//     });
//     pagination.appendChild(next);

//     paginationContainer.appendChild(pagination);
// }

// function searchProducts() {
//     const input = document.getElementById('searchInput').value.toLowerCase();
//     const filteredProducts = allProducts.filter(product => product.product_name.toLowerCase().includes(input));
//     currentPage = 1; // Reset to the first page
//     displayPage(filteredProducts, currentPage);
//     setupPaginationForSearch(filteredProducts);
// }

// function setupPaginationForSearch(products) {
//     const paginationContainer = document.getElementById("pagination");
//     paginationContainer.innerHTML = "";

//     if (products.length <= productsPerPage) {
//         return; // No pagination needed if all products fit on one page
//     }

//     const pagination = document.createElement("div");
//     pagination.className = "pagination";

//     const prev = document.createElement("a");
//     prev.innerHTML = "&laquo;";
//     prev.addEventListener("click", function () {
//         if (currentPage > 1) {
//             currentPage--;
//             displayPage(products, currentPage);
//             setupPaginationForSearch(products);
//         }
//     });
//     pagination.appendChild(prev);

//     for (let i = 1; i <= totalPages; i++) {
//         const page = document.createElement("a");
//         page.textContent = i;
//         if (i === currentPage) {
//             page.className = "active";
//         }
//         page.addEventListener("click", function () {
//             currentPage = i;
//             displayPage(products, currentPage);
//             setupPaginationForSearch(products);
//         });
//         pagination.appendChild(page);
//     }

//     const next = document.createElement("a");
//     next.innerHTML = "&raquo;";
//     next.addEventListener("click", function () {
//         if (currentPage < totalPages) {
//             currentPage++;
//             displayPage(products, currentPage);
//             setupPaginationForSearch(products);
//         }
//     });
//     pagination.appendChild(next);

//     paginationContainer.appendChild(pagination);
// }

// // Call displayProducts() to populate the cards when the page loads
// window.onload = function () {
//     displayProducts();
// };