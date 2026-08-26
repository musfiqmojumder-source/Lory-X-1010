/* =========================================================
   LORY X 1010
   PRODUCT SYSTEM
   Supabase + Search + Filter + WhatsApp Order
========================================================= */


/* =========================================================
   SUPABASE CONFIG
========================================================= */

const SUPABASE_URL =
    "https://hmvzqwatmsctlvzylmys.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_BJXkMjk7jvgYKXgiYMbvUw_6S17oAAY";

const supabaseClient =
    window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_KEY
    );


/* =========================================================
   WHATSAPP CONFIG
========================================================= */

const WHATSAPP_NUMBER =
    "8801754618724";


/* =========================================================
   GLOBAL PRODUCT DATA
========================================================= */

let products = [];


/* =========================================================
   DEFAULT IMAGE
========================================================= */

const DEFAULT_IMAGE =
    "https://placehold.co/800x800?text=Lory+X+1010";


/* =========================================================
   ESCAPE HTML
   Prevent unsafe HTML from product data
========================================================= */

function escapeHTML(value) {

    if (value === null ||
        value === undefined) {

        return "";
    }

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


/* =========================================================
   FORMAT PRICE
========================================================= */

function formatPrice(price) {

    const number =
        Number(price) || 0;

    return `৳${number.toLocaleString("en-BD")}`;
}


/* =========================================================
   NORMALIZE CATEGORY
========================================================= */

function normalizeCategory(category) {

    return String(category || "Others")
        .trim()
        .toLowerCase();

}


/* =========================================================
   CREATE PRODUCT CARD
========================================================= */

function createProductCard(product) {

    const id =
        encodeURIComponent(product.id);

    const name =
        escapeHTML(product.name || "Unnamed Product");

    const category =
        escapeHTML(product.category || "Others");

    const image =
        product.image_url || DEFAULT_IMAGE;

    const price =
        formatPrice(product.price);


    return `

        <article class="product-card">

            <a
                href="product.html?id=${id}"
                aria-label="View ${name}"
            >

                <div class="product-image">

                    <img
                        src="${escapeHTML(image)}"
                        alt="${name}"
                        loading="lazy"
                        onerror="this.src='${DEFAULT_IMAGE}'"
                    >

                </div>

            </a>


            <div class="product-info">

                <div class="product-category">
                    ${category}
                </div>


                <h3 class="product-name">
                    ${name}
                </h3>


                <div class="product-price">
                    ${price}
                </div>


                <a
                    href="product.html?id=${id}"
                    class="product-button"
                >
                    View Product
                </a>

            </div>

        </article>

    `;
}


/* =========================================================
   DISPLAY PRODUCTS
========================================================= */

function displayProducts(
    productList,
    containerId
) {

    const container =
        document.getElementById(containerId);

    if (!container) {
        return;
    }


    const noProducts =
        document.getElementById("no-products");


    /* Empty result */

    if (!productList ||
        productList.length === 0) {

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
            .map(createProductCard)
            .join("");

}


/* =========================================================
   LOADING MESSAGE
========================================================= */

function showLoading(containerId) {

    const container =
        document.getElementById(containerId);

    if (!container) {
        return;
    }


    container.innerHTML = `

        <div class="loading">

            <div class="loading-spinner"></div>

            <p>
                Loading products...
            </p>

        </div>

    `;

}


/* =========================================================
   ERROR MESSAGE
========================================================= */

function showProductError(containerId) {

    const container =
        document.getElementById(containerId);

    if (!container) {
        return;
    }


    container.innerHTML = `

        <div
            style="
                grid-column:1/-1;
                text-align:center;
                padding:70px 20px;
            "
        >

            <h2>
                Unable to load products
            </h2>

            <p
                style="
                    color:#666;
                    margin:10px 0 25px;
                "
            >
                Please check your internet connection
                and try again.
            </p>

            <button
                type="button"
                class="primary-btn"
                onclick="loadProducts()"
            >
                Try Again
            </button>

        </div>

    `;

}


/* =========================================================
   LOAD PRODUCTS FROM SUPABASE
========================================================= */

async function loadProducts() {

    const allProductsContainer =
        document.getElementById("all-products");

    const featuredContainer =
        document.getElementById("featured-products");


    if (allProductsContainer) {
        showLoading("all-products");
    }


    if (featuredContainer) {
        showLoading("featured-products");
    }


    try {

        const {
            data,
            error
        } = await supabaseClient

            .from("products")

            .select("*")

            .eq(
                "is_published",
                true
            )

            .order(
                "created_at",
                {
                    ascending: false
                }
            );


        if (error) {
            throw error;
        }


        products =
            Array.isArray(data)
                ? data
                : [];


        /* =====================================
           ALL PRODUCTS
        ===================================== */

        displayProducts(
            products,
            "all-products"
        );


        /* =====================================
           FEATURED PRODUCTS
           First 4 latest products
        ===================================== */

        displayProducts(
            products.slice(0, 4),
            "featured-products"
        );


        /*
           Apply URL category if available
        */

        applyURLCategory();


    } catch (error) {

        console.error(
            "Supabase Product Error:",
            error
        );


        showProductError(
            "all-products"
        );


        showProductError(
            "featured-products"
        );

    }

}


/* =========================================================
   SEARCH + CATEGORY FILTER
========================================================= */

function setupProductFilters() {

    const searchInput =
        document.getElementById(
            "product-search"
        );


    const filterButtons =
        document.querySelectorAll(
            ".filter-btn"
        );


    /*
       If this is not products page,
       do nothing.
    */

    if (!searchInput &&
        filterButtons.length === 0) {

        return;
    }


    let currentCategory = "all";


    /* =====================================
       FILTER FUNCTION
    ===================================== */

    function filterProducts() {

        const searchText =
            searchInput
                ? searchInput.value
                    .toLowerCase()
                    .trim()
                : "";


        const filtered =
            products.filter(product => {

                const name =
                    String(
                        product.name || ""
                    ).toLowerCase();


                const category =
                    String(
                        product.category || "Others"
                    ).toLowerCase();


                const description =
                    String(
                        product.description || ""
                    ).toLowerCase();


                const categoryMatch =

                    currentCategory === "all"

                    ||

                    normalizeCategory(
                        product.category
                    ) ===
                    normalizeCategory(
                        currentCategory
                    );


                const searchMatch =

                    !searchText

                    ||

                    name.includes(searchText)

                    ||

                    category.includes(searchText)

                    ||

                    description.includes(searchText);


                return (
                    categoryMatch &&
                    searchMatch
                );

            });


        displayProducts(
            filtered,
            "all-products"
        );

    }


    /* =====================================
       SEARCH EVENT
    ===================================== */

    if (searchInput) {

        searchInput.addEventListener(
            "input",
            filterProducts
        );

    }


    /* =====================================
       CATEGORY BUTTONS
    ===================================== */

    filterButtons.forEach(button => {

        button.addEventListener(
            "click",
            () => {

                currentCategory =
                    button.dataset.category ||
                    "all";


                /*
                   Active button
                */

                filterButtons.forEach(btn => {

                    btn.classList.remove(
                        "active"
                    );

                });


                button.classList.add(
                    "active"
                );


                filterProducts();

            }
        );

    });


    /*
       Save filter function
       for URL category system
    */

    window.applyProductFilter =
        function(category) {

            currentCategory =
                category || "all";


            filterButtons.forEach(button => {

                const buttonCategory =
                    button.dataset.category ||
                    "all";


                if (
                    normalizeCategory(
                        buttonCategory
                    ) ===
                    normalizeCategory(
                        currentCategory
                    )
                ) {

                    button.classList.add(
                        "active"
                    );

                } else {

                    button.classList.remove(
                        "active"
                    );

                }

            });


            filterProducts();

        };

}


/* =========================================================
   URL CATEGORY FILTER
========================================================= */

function applyURLCategory() {

    const params =
        new URLSearchParams(
            window.location.search
        );


    const category =
        params.get("category");


    if (!category) {
        return;
    }


    /*
       Convert URL values such as:

       fashion
       gadget
       home
       others

       to the filter button's value.
    */

    let categoryName =
        category;


    if (
        category.toLowerCase()
            === "fashion"
    ) {

        categoryName = "Fashion";

    }


    if (
        category.toLowerCase()
            === "gadget"
    ) {

        categoryName = "Gadget";

    }


    if (
        category.toLowerCase()
            === "home"
    ) {

        categoryName = "Home";

    }


    if (
        category.toLowerCase()
            === "others"
    ) {

        categoryName = "Others";

    }


    if (
        typeof window.applyProductFilter
        === "function"
    ) {

        window.applyProductFilter(
            categoryName
        );

    }

}


/* =========================================================
   CREATE WHATSAPP MESSAGE
========================================================= */

function createWhatsAppMessage(
    product,
    quantity
) {

    const productName =
        product.name || "Product";


    const productId =
        product.id || "";


    const price =
        formatPrice(product.price);


    const total =
        (Number(product.price) || 0)
        *
        quantity;


    return `Hello Lory X 1010,

I want to order this product.

Product: ${productName}
Product ID: ${productId}
Price: ${price}
Quantity: ${quantity}
Total: ${formatPrice(total)}

Please confirm my order.

Thank you.`;

}


/* =========================================================
   OPEN WHATSAPP ORDER
========================================================= */

function orderOnWhatsApp(
    product,
    quantity
) {

    const message =
        createWhatsAppMessage(
            product,
            quantity
        );


    const whatsappURL =
        "https://wa.me/" +
        WHATSAPP_NUMBER +
        "?text=" +
        encodeURIComponent(
            message
        );


    window.open(
        whatsappURL,
        "_blank",
        "noopener,noreferrer"
    );

}


/* =========================================================
   PRODUCT DETAILS
========================================================= */

async function loadProductDetails() {

    const container =
        document.getElementById(
            "product-detail"
        );


    if (!container) {
        return;
    }


    const params =
        new URLSearchParams(
            window.location.search
        );


    const productId =
        params.get("id");


    if (!productId) {

        showProductNotFound(
            container
        );

        return;

    }


    try {

        const {
            data: product,
            error
        } = await supabaseClient

            .from("products")

            .select("*")

            .eq(
                "id",
                productId
            )

            .eq(
                "is_published",
                true
            )

            .single();


        if (error ||
            !product) {

            throw error ||
                new Error(
                    "Product not found"
                );

        }


        /*
           Page title
        */

        document.title =
            `${product.name} | Lory X 1010`;


        /*
           Product data
        */

        const image =
            product.image_url ||
            DEFAULT_IMAGE;


        const name =
            escapeHTML(
                product.name ||
                "Unnamed Product"
            );


        const category =
            escapeHTML(
                product.category ||
                "Others"
            );


        const description =
            escapeHTML(
                product.description ||
                "No description available."
            );


        const price =
            formatPrice(
                product.price
            );


        /*
           Stock
        */

        const stock =
            Number(product.stock);


        const hasStock =
            Number.isNaN(stock)
                ? true
                : stock > 0;


        /*
           Sizes
        */

        const sizes =
            product.sizes
                ? escapeHTML(
                    product.sizes
                )
                : "";


        /*
           Colors
        */

        const colors =
            product.colors
                ? escapeHTML(
                    product.colors
                )
                : "";


        /*
           Build detail page
        */

        container.innerHTML = `

            <div class="detail-image">

                <img
                    src="${escapeHTML(image)}"
                    alt="${name}"
                    onerror="this.src='${DEFAULT_IMAGE}'"
                >

            </div>


            <div class="detail-info">


                <div class="detail-category">
                    ${category}
                </div>


                <h1 class="detail-title">
                    ${name}
                </h1>


                <div class="detail-price">
                    ${price}
                </div>


                <p class="detail-description">
                    ${description}
                </p>


                <div class="product-meta">


                    ${
                        sizes
                        ? `

                            <div class="meta-row">

                                <div class="meta-label">
                                    Sizes
                                </div>

                                <div class="meta-value">
                                    ${sizes}
                                </div>

                            </div>

                        `
                        : ""
                    }


                    ${
                        colors
                        ? `

                            <div class="meta-row">

                                <div class="meta-label">
                                    Colors
                                </div>

                                <div class="meta-value">
                                    ${colors}
                                </div>

                            </div>

                        `
                        : ""
                    }


                    <div class="meta-row">

                        <div class="meta-label">
                            Availability
                        </div>


                        <div
                            class="
                                meta-value
                                stock
                                ${
                                    hasStock
                                        ? "in-stock"
                                        : "out-stock"
                                }
                            "
                        >

                            ${
                                hasStock
                                    ? "In Stock"
                                    : "Out of Stock"
                            }

                        </div>

                    </div>


                </div>


                ${
                    hasStock
                    ? `

                        <div class="order-area">

                            <div class="order-label">
                           
