/* =========================================
   LORY X 1010
   Main JavaScript
========================================= */

const products = [
    /*
    Example product:

    {
        id: 1,
        name: "Product Name",
        category: "Fashion",
        price: "৳999",
        image: "images/product-1.jpg",
        link: "#"
    }
    */
];


/* =========================================
   FEATURED PRODUCTS
========================================= */

function loadFeaturedProducts() {

    const container = document.getElementById("featured-products");

    if (!container) return;

    if (products.length === 0) {

        container.innerHTML = `
            <div style="
                grid-column: 1 / -1;
                text-align: center;
                padding: 50px 20px;
                color: #666;
            ">
                <h3>Products Coming Soon</h3>
                <p>
                    Our products will appear here soon.
                </p>
            </div>
        `;

        return;
    }

    container.innerHTML = products
        .slice(0, 8)
        .map(product => createProductCard(product))
        .join("");
}


/* =========================================
   PRODUCT CARD
========================================= */

function createProductCard(product) {

    return `
        <article class="product-card">

            <a href="${product.link || "#"}">

                <div class="product-image">

                    <img
                        src="${product.image}"
                        alt="${product.name}"
                        loading="lazy"
                    >

                </div>

            </a>

            <div class="product-info">

                <div class="product-category">
                    ${product.category}
                </div>

                <h3 class="product-name">
                    ${product.name}
                </h3>

                <div class="product-price">
                    ${product.price}
                </div>

                <a
                    href="${product.link || "#"}"
                    class="product-button"
                >
                    View Product
                </a>

            </div>

        </article>
    `;
}


/* =========================================
   START WEBSITE
========================================= */

document.addEventListener("DOMContentLoaded", () => {

    loadFeaturedProducts();

});
