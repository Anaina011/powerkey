// // app.js
// function fetchAndDisplayProducts() {
//     const db = firebase.database().ref("product");

//     db.once("value", (snapshot) => {
//         const products = snapshot.val();
//         const container = document.getElementById("product-container");
//         container.innerHTML = ""; // Clear previous data

//         let productKeys = Object.keys(products);
//         let rows = Math.ceil(productKeys.length / 3);

//         for (let i = 0; i < rows; i++) {
//             let row = document.createElement("div");
//             row.className = "product-row";
//             row.id = `row-${i}`;

//             let start = i * 3;
//             let end = start + 3;
//             let productSlice = productKeys.slice(start, end);

//             productSlice.forEach(key => {
//                 const product = products[key];
//                 const card = document.createElement("div");
//                 card.className = "product-card";
//                 card.innerHTML = `
//                     <img src="${product.product_image}" class="product-image">
//                     <div class="product-info">
//                         <div class="product-name">${product.product_name}</div>
//                         <div class="product-details">${product.product_details.join('<br>')}</div>
//                         <div class="home-slide-button1 contact-button">
//                             <a href="contact.html">
//                                 <button>
//                                     Contact Us <div class="arrow-wrapper"><div class="arrow"></div></div>
//                                 </button>
//                             </a>
//                         </div>
//                     </div>
//                 `;
//                 row.appendChild(card);
//             });

//             container.appendChild(row);

//             // Initialize Slick Carousel for the row
//             $(`#row-${i}`).slick({
//                 infinite: false,
//                 slidesToShow: 3,
//                 slidesToScroll: 3,
//                 dots: false, // Disable dots
//                 responsive: [
//                     {
//                         breakpoint: 768,
//                         settings: {
//                             slidesToShow: 1,
//                             slidesToScroll: 1,
//                             arrows: false,
//                             dots: false // Ensure dots are disabled on smaller screens too
//                         }
//                     }
//                 ]
//             });
//         }
//     }).catch(error => {
//         console.error("Error fetching products: ", error);
//     });
// }




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
