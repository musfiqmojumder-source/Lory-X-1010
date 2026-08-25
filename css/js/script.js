/* =========================================
   LORY X 1010
   Product System
========================================= */

const products = [
    {
        id: 1,
        name: "Premium Casual Shirt",
        category: "Fashion",
        price: "৳899",
        image: "https://placehold.co/800x800?text=Product+1",
        description: "Premium quality casual shirt for everyday use.",
        shopBaseLink: "#"
    },

    {
        id: 2,
        name: "Classic Polo T-Shirt",
        category: "Fashion",
        price: "৳699",
        image: "https://placehold.co/800x800?text=Product+2",
        description: "Comfortable and stylish polo t-shirt.",
        shopBaseLink: "#"
    },

    {
        id: 3,
        name: "Smart Wireless Gadget",
        category: "Gadgets",
        price: "৳1,299",
        image: "https://placehold.co/800x800?text=Product+3",
        description: "A useful wireless gadget for everyday life.",
        shopBaseLink: "#"
    },

    {
        id: 4,
        name: "Modern Home Item",
        category: "Home",
        price: "৳599",
        image: "https://placehold.co/800x800?text=Product+4",
        description: "A practical and modern product for your home.",
        shopBaseLink: "#"
    }
];


/* =========================================
   PRODUCT CARD
========================================= */

function createProductCard(product) {

    return `
        <article class="product-card">

            <a href="product.html?id=${product.id}">

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
                    href="product.html?id=${product.id}"
                    class="product-button"
                >
                    View Product
                </a>

            </div>

        </article>
    `;
}


/* =========================================
   DISPLAY PRODUCTS
========================================= */

function displayProducts(productList, containerId) {

    const container =
        document.getElementById(containerId);

    if (!container) return;

    const noProducts =
        document.getElementById("no-products");

    if (productList.length === 0) {

        container.innerHTML = "";

        if (noProducts) {
            noProducts.style.display = "block";
        }

        return;
    }

    if (noProducts) {
        noProducts.style.display = "none";
    }

    container.innerHTML = productList
        .map(product => createProductCard(product))
        .join("");
}


/* =========================================
   FEATURED PRODUCTS
========================================= */

function loadFeaturedProducts() {

    displayProducts(
        products.slice(0, 4),
        "featured-products"
    );
}


/* =========================================
   ALL PRODUCTS
========================================= */

function loadAllProducts() {

    displayProducts(
        products,
        "all-products"
    );
}


/* =========================================
   SEARCH + CATEGORY FILTER
========================================= */

function setupProductFilters() {

    const searchInput =
        document.getElementById("product-search");

    const filterButtons =
        document.querySelectorAll(".filter-btn");

    if (!searchInput && filterButtons.length === 0) {
        return;
    }

    let currentCategory = "all";

    function filterProducts() {

        const searchText =
            searchInput
                ? searchInput.value.toLowerCase().trim()
                : "";

        const filteredProducts =
            products.filter(product => {

                const matchesCategory =
                    currentCategory === "all" ||
                    product.category === currentCategory;

                const matchesSearch =
                    product.name
                        .toLowerCase()
                        .includes(searchText) ||

                    product.category
                        .toLowerCase()
                        .includes(searchText);

                return matchesCategory &&
                       matchesSearch;
            });

        displayProducts(
            filteredProducts,
            "all-products"
        );
    }


    if (searchInput) {

        searchInput.addEventListener(
            "input",
            filterProducts
        );

    }


    filterButtons.forEach(button => {

        button.addEventListener("click", () => {

            currentCategory =
                button.dataset.category;

            filterButtons.forEach(btn => {

                btn.style.background = "#ffffff";
                btn.style.color = "#111111";

            });

            button.style.background = "#111111";
            button.style.color = "#ffffff";

            filterProducts();

        });

    });

}


/* =========================================
   PRODUCT DETAILS
========================================= */

function loadProductDetails() {

    const container =
        document.getElementById("product-detail");

    if (!container) return;

    const params =
        new URLSearchParams(window.location.search);

    const productId =
        Number(params.get("id"));

    const product =
        products.find(item => item.id === productId);

    if (!product) {

        container.innerHTML = `
            <div style="
                grid-column: 1 / -1;
                text-align: center;
                padding: 60px 20px;
            ">

                <h2>Product Not Found</h2>

                <p style="margin: 15px 0 25px;">
                    Sorry, this product is not available.
                </p>

                <a
                    href="products.html"
                    class="primary-btn"
                >
                    Back to Products
                </a>

            </div>
        `;

        return;
    }


    document.title =
        `${product.name} | Lory X 1010`;


    container.innerHTML = `

        <div class="detail-image">

            <img
                src="${product.image}"
                alt="${product.name}"
            >

        </div>


        <div>

            <div class="detail-category">
                ${product.category}
            </div>

            <h1 class="detail-title">
                ${product.name}
            </h1>

            <div class="detail-price">
                ${product.price}
            </div>

            <p class="detail-description">
                ${product.description}
            </p>

            <a
                href="${product.shopBaseLink}"
                class="buy-button"
                target="_blank"
                rel="noopener"
            >
                Buy Now
            </a>

        </div>

    `;
}


/* =========================================
   START WEBSITE
========================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        loadFeaturedProducts();

        loadAllProducts();

        setupProductFilters();

        loadProductDetails();

    }
);
