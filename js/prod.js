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











function fetchAndDisplayProducts() {
    const db = firebase.database().ref("product");

    db.once("value", (snapshot) => {
        const products = snapshot.val();
        const container = document.getElementById("product-container");
        container.innerHTML = ""; // Clear previous data

        let productKeys = Object.keys(products);
        let rows = Math.ceil(productKeys.length / 3);

        for (let i = 0; i < rows; i++) {
            let row = document.createElement("div");
            row.className = "product-row";
            row.id = `row-${i}`;

            let start = i * 3;
            let end = start + 3;
            let productSlice = productKeys.slice(start, end);

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
                        <ul class="product-details">${product.product_details.map(detail => `<li>${detail}</li>`).join('')}</ul>
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
                        breakpoint: 768,
                        settings: {
                            slidesToShow: 1,
                            slidesToScroll: 1,
                            arrows: false,
                            dots: false // Ensure dots are disabled on smaller screens too
                        }
                    }
                ]
            });
        }
    }).catch(error => {
        console.error("Error fetching products: ", error);
    });
}

// Call the function on page load
window.onload = fetchAndDisplayProducts;

