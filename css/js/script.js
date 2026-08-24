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
        image: "https://via.placeholder.com/600x600?text=Product+1",
        link: "#"
    },
    {
        id: 2,
        name: "Classic Polo T-Shirt",
        category: "Fashion",
        price: "৳699",
        image: "https://via.placeholder.com/600x600?text=Product+2",
        link: "#"
    },
    {
        id: 3,
        name: "Smart Wireless Gadget",
        category: "Gadgets",
        price: "৳1,299",
        image: "https://via.placeholder.com/600x600?text=Product+3",
        link: "#"
    },
    {
        id: 4,
        name: "Modern Home Item",
        category: "Home",
        price: "৳599",
        image: "https://via.placeholder.com/600x600?text=Product+4",
        link: "#"
    }
];


/* =========================================
   PRODUCT CARD
========================================= */

function createProductCard(product) {

    return `
        <article class="product-card">

            <a href="${product.link}">

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
                    href="${product.link}"
                    class="product-button"
                >
                    View Product
                </a>

            </div>

        </article>
    `;
}


/* =========================================
   SHOW PRODUCTS
========================================= */

function displayProducts(productList, containerId) {

    const container = document.getElementById(containerId);

    if (!container) return;

    const noProducts = document.getElementById("no-products");

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
   SEARCH + FILTER
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

        const filteredProducts = products.filter(product => {

            const matchesCategory =
                currentCategory === "all" ||
                product.category === currentCategory;

            const matchesSearch =
                product.name.toLowerCase().includes(searchText) ||
                product.category.toLowerCase().includes(searchText);

            return matchesCategory && matchesSearch;
        });

        displayProducts(
            filteredProducts,
            "all-products"
        );
    }


    /* Search */

    if (searchInput) {

        searchInput.addEventListener(
            "input",
            filterProducts
        );

    }


    /* Category buttons */

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
   START
========================================= */

document.addEventListener("DOMContentLoaded", () => {

    loadFeaturedProducts();

    loadAllProducts();

    setupProductFilters();

});
