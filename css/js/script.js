/* =========================================
   LORY X 1010
   Supabase Product System
========================================= */


/* =========================================
   SUPABASE CONFIG
========================================= */

const SUPABASE_URL =
    "https://hmvzqwatmsctlvzylmys.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_BJXkMjk7jvgYKXgiYMbvUw_6S17oAAY";


const supabaseClient =
    window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_KEY
    );


/* =========================================
   PRODUCT DATA
========================================= */

let products = [];


/* =========================================
   CREATE PRODUCT CARD
========================================= */

function createProductCard(product) {

    const price =
        `৳${Number(product.price).toLocaleString("en-BD")}`;

    return `
        <article class="product-card">

            <a href="product.html?id=${product.id}">

                <div class="product-image">

                    <img
                        src="${product.image_url || "https://placehold.co/800x800?text=No+Image"}"
                        alt="${product.name}"
                        loading="lazy"
                    >

                </div>

            </a>

            <div class="product-info">

                <div class="product-category">
                    ${product.category || "Others"}
                </div>

                <h3 class="product-name">
                    ${product.name}
                </h3>

                <div class="product-price">
                    ${price}
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


    container.innerHTML =
        productList
            .map(product => createProductCard(product))
            .join("");
}


/* =========================================
   LOAD PRODUCTS FROM SUPABASE
========================================= */

async function loadProducts() {

    const {
        data,
        error
    } = await supabaseClient
        .from("products")
        .select("*")
        .eq("is_published", true)
        .order("created_at", {
            ascending: false
        });


    if (error) {

        console.error(
            "Product loading error:",
            error
        );

        const container =
            document.getElementById("all-products");

        if (container) {

            container.innerHTML = `
                <div style="
                    grid-column: 1 / -1;
                    text-align: center;
                    padding: 60px 20px;
                ">

                    <h3>Unable to load products</h3>

                    <p style="
                        color: #666;
                        margin-top: 10px;
                    ">
                        Please try again later.
                    </p>

                </div>
            `;
        }

        return;
    }


    products = data || [];


    /* ALL PRODUCTS */

    displayProducts(
        products,
        "all-products"
    );


    /* FEATURED PRODUCTS */

    displayProducts(
        products.slice(0, 4),
        "featured-products"
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


    if (!searchInput &&
        filterButtons.length === 0) {

        return;
    }


    let currentCategory = "all";


    function filterProducts() {

        const searchText =
            searchInput
                ? searchInput.value
                    .toLowerCase()
                    .trim()
                : "";


        const filteredProducts =
            products.filter(product => {

                const productCategory =
                    product.category || "Others";


                const matchesCategory =
                    currentCategory === "all" ||
                    productCategory === currentCategory;


                const productName =
                    (product.name || "")
                        .toLowerCase();


                const categoryText =
                    productCategory
                        .toLowerCase();


                const matchesSearch =
                    productName.includes(searchText) ||
                    categoryText.includes(searchText);


                return (
                    matchesCategory &&
                    matchesSearch
                );
            });


        displayProducts(
            filteredProducts,
            "all-products"
        );
    }


    /* SEARCH */

    if (searchInput) {

        searchInput.addEventListener(
            "input",
            filterProducts
        );

    }


    /* CATEGORY BUTTONS */

    filterButtons.forEach(button => {

        button.addEventListener(
            "click",
            () => {

                currentCategory =
                    button.dataset.category;


                filterButtons.forEach(btn => {

                    btn.style.background =
                        "#ffffff";

                    btn.style.color =
                        "#111111";

                });


                button.style.background =
                    "#111111";

                button.style.color =
                    "#ffffff";


                filterProducts();

            }
        );

    });

}


/* =========================================
   PRODUCT DETAILS
========================================= */

async function loadProductDetails() {

    const container =
        document.getElementById("product-detail");


    if (!container) return;


    const params =
        new URLSearchParams(
            window.location.search
        );


    const productId =
        params.get("id");


    if (!productId) {

        showProductNotFound(container);

        return;
    }


    const {
        data: product,
        error
    } = await supabaseClient
        .from("products")
        .select("*")
        .eq("id", productId)
        .eq("is_published", true)
        .single();


    if (error || !product) {

        console.error(
            "Product details error:",
            error
        );

        showProductNotFound(container);

        return;
    }


    document.title =
        `${product.name} | Lory X 1010`;


    const price =
        `৳${Number(product.price).toLocaleString("en-BD")}`;


    container.innerHTML = `

        <div class="detail-image">

            <img
                src="${product.image_url || "https://placehold.co/800x800?text=No+Image"}"
                alt="${product.name}"
            >

        </div>


        <div>

            <div class="detail-category">
                ${product.category || "Others"}
            </div>


            <h1 class="detail-title">
                ${product.name}
            </h1>


            <div class="detail-price">
                ${price}
            </div>


            <p class="detail-description">
                ${product.description || "No description available."}
            </p>


            ${
                product.sizes
                ? `
                    <p style="margin-bottom:15px;">
                        <strong>Sizes:</strong>
                        ${product.sizes}
                    </p>
                  `
                : ""
            }


            ${
                product.colors
                ? `
                    <p style="margin-bottom:15px;">
                        <strong>Colors:</strong>
                        ${product.colors}
                    </p>
                  `
                : ""
            }


            ${
                product.stock > 0
                ? `
                    <p style="
                        color: green;
                        margin-bottom: 20px;
                    ">
                        In Stock
                    </p>
                  `
                : `
                    <p style="
                        color: #d00;
                        margin-bottom: 20px;
                    ">
                        Out of Stock
                    </p>
                  `
            }


            <a
                href="#"
                class="buy-button"
                onclick="return false;"
            >
                Buy Now
            </a>

        </div>

    `;
}


/* =========================================
   PRODUCT NOT FOUND
========================================= */

function showProductNotFound(container) {

    container.innerHTML = `

        <div style="
            grid-column: 1 / -1;
            text-align: center;
            padding: 60px 20px;
        ">

            <h2>
                Product Not Found
            </h2>

            <p style="
                margin: 15px 0 25px;
            ">
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
}


/* =========================================
   START WEBSITE
========================================= */

document.addEventListener(
    "DOMContentLoaded",
    async () => {

        await loadProducts();

        setupProductFilters();

        await loadProductDetails();

    }
);
