/* =========================================================
   LORY X 1010
   ADMIN PRODUCT SYSTEM
   Supabase Auth + Storage + Products
========================================================= */


/* =========================================================
   SUPABASE
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
   SETTINGS
========================================================= */

const STORAGE_BUCKET =
    "products";


/*
   IMPORTANT

   এখানে চাইলে আপনার admin email বসিয়ে
   extra frontend protection দিতে পারেন।

   উদাহরণ:

   const ADMIN_EMAIL = "your@email.com";

   এখন empty রাখা হয়েছে যাতে আপনার
   Supabase Auth user দিয়ে login করা যায়।
*/

const ADMIN_EMAIL = "";


/* =========================================================
   STATE
========================================================= */

let editingProductId = null;

let currentProducts = [];

let selectedImageFile = null;

let oldImageUrl = null;


/* =========================================================
   DEFAULT IMAGE
========================================================= */

const DEFAULT_IMAGE =
    "https://placehold.co/800x800?text=Lory+X+1010";


/* =========================================================
   ELEMENTS
========================================================= */

const loginSection =
    document.getElementById("loginSection");

const dashboardSection =
    document.getElementById("dashboardSection");

const loginForm =
    document.getElementById("loginForm");

const emailInput =
    document.getElementById("email");

const passwordInput =
    document.getElementById("password");

const togglePassword =
    document.getElementById("togglePassword");

const loginButton =
    document.getElementById("loginButton");

const loginMessage =
    document.getElementById("loginMessage");

const logoutButton =
    document.getElementById("logoutButton");

const adminEmailText =
    document.getElementById("adminEmailText");

const productForm =
    document.getElementById("productForm");

const productName =
    document.getElementById("productName");

const productPrice =
    document.getElementById("productPrice");

const productCategory =
    document.getElementById("productCategory");

const productStock =
    document.getElementById("productStock");

const productImage =
    document.getElementById("productImage");

const productSizes =
    document.getElementById("productSizes");

const productColors =
    document.getElementById("productColors");

const productDescription =
    document.getElementById("productDescription");

const productPublished =
    document.getElementById("productPublished");

const saveProductButton =
    document.getElementById("saveProductButton");

const cancelEditButton =
    document.getElementById("cancelEditButton");

const productMessage =
    document.getElementById("productMessage");

const imagePreviewBox =
    document.getElementById("imagePreviewBox");

const imagePreview =
    document.getElementById("imagePreview");

const removeImageButton =
    document.getElementById("removeImageButton");

const productList =
    document.getElementById("productList");

const refreshButton =
    document.getElementById("refreshButton");

const formTitle =
    document.getElementById("formTitle");

const totalProducts =
    document.getElementById("totalProducts");

const publishedProducts =
    document.getElementById("publishedProducts");

const hiddenProducts =
    document.getElementById("hiddenProducts");


/* =========================================================
   MESSAGE
========================================================= */

function showMessage(
    element,
    message,
    type = "info"
) {

    if (!element) return;

    element.textContent =
        message;

    element.className =
        "admin-message";

    if (type === "success") {

        element.classList.add(
            "message-success"
        );

    }

    if (type === "error") {

        element.classList.add(
            "message-error"
        );

    }

    if (type === "info") {

        element.classList.add(
            "message-info"
        );

    }

}


/* =========================================================
   FORMAT PRICE
========================================================= */

function formatPrice(price) {

    return (
        "৳" +
        Number(price || 0)
            .toLocaleString("en-BD")
    );

}


/* =========================================================
   ESCAPE HTML
========================================================= */

function escapeHTML(value) {

    if (
        value === null ||
        value === undefined
    ) {

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
   SHOW LOGIN
========================================================= */

function showLogin() {

    loginSection.hidden =
        false;

    dashboardSection.hidden =
        true;

}


/* =========================================================
   SHOW DASHBOARD
========================================================= */

function showDashboard(user) {

    loginSection.hidden =
        true;

    dashboardSection.hidden =
        false;


    if (user) {

        adminEmailText.textContent =
            user.email || "Admin";

    }

}


/* =========================================================
   LOGIN
========================================================= */

loginForm.addEventListener(
    "submit",
    async function(event) {

        event.preventDefault();

        await login();

    }
);


async function login() {

    const email =
        emailInput.value.trim();

    const password =
        passwordInput.value;


    if (!email) {

        showMessage(
            loginMessage,
            "Please enter your email.",
            "error"
        );

        return;

    }


    if (!password) {

        showMessage(
            loginMessage,
            "Please enter your password.",
            "error"
        );

        return;

    }


    /*
       Optional frontend admin email check
    */

    if (
        ADMIN_EMAIL &&
        email.toLowerCase() !==
        ADMIN_EMAIL.toLowerCase()
    ) {

        showMessage(
            loginMessage,
            "This account is not authorized as admin.",
            "error"
        );

        return;

    }


    loginButton.disabled =
        true;

    loginButton.textContent =
        "Signing in...";


    showMessage(
        loginMessage,
        "Connecting to Supabase...",
        "info"
    );


    try {

        const {
            data,
            error
        } =
            await supabaseClient.auth
                .signInWithPassword({

                    email:
                        email,

                    password:
                        password

                });


        if (error) {

            console.error(
                "Supabase Login Error:",
                error
            );

            showMessage(
                loginMessage,
                getLoginErrorMessage(error),
                "error"
            );

            return;

        }


        if (
            !data ||
            !data.user ||
            !data.session
        ) {

            showMessage(
                loginMessage,
                "Login failed. No active session was created.",
                "error"
            );

            return;

        }


        showMessage(
            loginMessage,
            "Login successful.",
            "success"
        );


        showDashboard(
            data.user
        );


        await loadProducts();

    }

    catch(error) {

        console.error(
            "Login Exception:",
            error
        );

        showMessage(
            loginMessage,
            "Connection error: " +
            error.message,
            "error"
        );

    }

    finally {

        loginButton.disabled =
            false;

        loginButton.textContent =
            "Login";

    }

}


/* =========================================================
   LOGIN ERROR
========================================================= */

function getLoginErrorMessage(error) {

    const message =
        String(
            error?.message || ""
        );


    if (
        message.toLowerCase()
            .includes("invalid login credentials")
    ) {

        return "Incorrect email or password.";

    }


    if (
        message.toLowerCase()
            .includes("email not confirmed")
    ) {

        return "Your email is not confirmed in Supabase.";

    }


    if (
        message.toLowerCase()
            .includes("failed to fetch")
    ) {

        return "Unable to connect to Supabase. Check your internet connection.";

    }


    return message ||
        "Login failed. Please try again.";

}


/* =========================================================
   PASSWORD VISIBILITY
========================================================= */

togglePassword.addEventListener(
    "click",
    function() {

        const isPassword =
            passwordInput.type ===
            "password";


        passwordInput.type =
            isPassword
                ? "text"
                : "password";


        togglePassword.textContent =
            isPassword
                ? "Hide"
                : "Show";

    }
);


/* =========================================================
   SESSION CHECK
========================================================= */

async function checkSession() {

    try {

        const {
            data,
            error
        } =
            await supabaseClient.auth
                .getSession();


        if (error) {

            console.error(
                "Session error:",
                error
            );

            showLogin();

            return;

        }


        const session =
            data?.session;


        if (!session) {

            showLogin();

            return;

        }


        const user =
            session.user;


        /*
           Optional admin email check
        */

        if (
            ADMIN_EMAIL &&
            user.email?.toLowerCase() !==
            ADMIN_EMAIL.toLowerCase()
        ) {

            await supabaseClient.auth.signOut();

            showLogin();

            showMessage(
                loginMessage,
                "This account is not authorized as admin.",
                "error"
            );

            return;

        }


        showDashboard(
            user
        );


        await loadProducts();

    }

    catch(error) {

        console.error(
            "Session check error:",
            error
        );

        showLogin();

    }

}


/* =========================================================
   AUTH STATE
========================================================= */

supabaseClient.auth.onAuthStateChange(
    function(event, session) {

        console.log(
            "Auth event:",
            event
        );


        if (
            session &&
            session.user
        ) {

            showDashboard(
                session.user
            );

        }


        if (
            event === "SIGNED_OUT"
        ) {

            showLogin();

        }

    }
);


/* =========================================================
   LOGOUT
========================================================= */

logoutButton.addEventListener(
    "click",
    async function() {

        logoutButton.disabled =
            true;

        logoutButton.textContent =
            "Logging out...";


        try {

            await supabaseClient.auth
                .signOut();

            resetProductForm();

            showLogin();

            emailInput.value =
                "";

            passwordInput.value =
                "";

            showMessage(
                loginMessage,
                "Logged out successfully.",
                "success"
            );

        }

        catch(error) {

            console.error(
                "Logout error:",
                error
            );

        }

        finally {

            logoutButton.disabled =
                false;

            logoutButton.textContent =
                "Logout";

        }

    }
);


/* =========================================================
   IMAGE SELECT
========================================================= */

productImage.addEventListener(
    "change",
    function() {

        const file =
            this.files?.[0];


        if (!file) {

            selectedImageFile =
                null;

            return;

        }


        if (
            !file.type.startsWith(
                "image/"
            )
        ) {

            showMessage(
                productMessage,
                "Please select an image file.",
                "error"
            );

            this.value =
                "";

            return;

        }


        if (
            file.size >
            5 * 1024 * 1024
        ) {

            showMessage(
                productMessage,
                "Image must be smaller than 5 MB.",
                "error"
            );

            this.value =
                "";

            return;

        }


        selectedImageFile =
            file;


        const objectURL =
            URL.createObjectURL(
                file
            );


        imagePreview.src =
            objectURL;

        imagePreviewBox.hidden =
            false;


        showMessage(
            productMessage,
            "",
            "info"
        );

    }
);


/* =========================================================
   REMOVE SELECTED IMAGE
========================================================= */

removeImageButton.addEventListener(
    "click",
    function() {

        selectedImageFile =
            null;

        productImage.value =
            "";

        imagePreview.src =
            "";

        imagePreviewBox.hidden =
            true;

    }
);


/* =========================================================
   UPLOAD IMAGE
========================================================= */

async function uploadProductImage(file) {

    if (!file) {

        return null;

    }


    const extension =
        file.name
            .split(".")
            .pop()
            .toLowerCase();


    const randomName =
        crypto.randomUUID();


    const filePath =
        `products/${Date.now()}-${randomName}.${extension}`;


    const {
        error
    } =
        await supabaseClient.storage
            .from(STORAGE_BUCKET)
            .upload(
                filePath,
                file,
                {
                    cacheControl:
                        "3600",

                    upsert:
                        false,

                    contentType:
                        file.type

                }
            );


    if (error) {

        throw new Error(
            "Image upload failed: " +
            error.message
        );

    }


    const {
        data
    } =
        supabaseClient.storage
            .from(STORAGE_BUCKET)
            .getPublicUrl(
                filePath
            );


    return data.publicUrl;

}


/* =========================================================
   DELETE STORAGE IMAGE
========================================================= */

async function deleteStorageImage(
    imageUrl
) {

    if (!imageUrl) return;


    try {

        const marker =
            `/storage/v1/object/public/${STORAGE_BUCKET}/`;


        const index =
            imageUrl.indexOf(
                marker
            );


        if (index === -1) {

            return;

        }


        const filePath =
            imageUrl.substring(
                index +
                marker.length
            );


        await supabaseClient.storage
            .from(STORAGE_BUCKET)
            .remove([
                filePath
            ]);

    }

    catch(error) {

        console.warn(
            "Old image delete warning:",
            error
        );

    }

}


/* =========================================================
   SAVE PRODUCT
========================================================= */

productForm.addEventListener(
    "submit",
    async function(event) {

        event.preventDefault();

        await saveProduct();

    }
);


async function saveProduct() {

    const name =
        productName.value.trim();

    const price =
        Number(
            productPrice.value
        );

    const category =
        productCategory.value.trim();

    const stock =
        Number(
            productStock.value || 0
        );

    const sizes =
        productSizes.value.trim();

    const colors =
        productColors.value.trim();

    const description =
        productDescription.value.trim();

    const isPublished =
        productPublished.checked;


    if (!name) {

        showMessage(
            productMessage,
            "Please enter product name.",
            "error"
        );

        return;

    }


    if (
        !Number.isFinite(price) ||
        price < 0
    ) {

        showMessage(
            productMessage,
            "Please enter a valid price.",
            "error"
        );

        return;

    }


    if (!category) {

        showMessage(
            productMessage,
            "Please select a category.",
            "error"
        );

        return;

    }


    if (
        !Number.isFinite(stock) ||
        stock < 0
    ) {

        showMessage(
            productMessage,
            "Please enter a valid stock quantity.",
            "error"
        );

        return;

    }


    saveProductButton.disabled =
        true;

    cancelEditButton.disabled =
        true;


    showMessage(
        productMessage,
        editingProductId
            ? "Updating product..."
            : "Adding product...",
        "info"
    );


    try {

        let imageUrl =
            oldImageUrl;


        /*
           Upload new image
        */

        if (selectedImageFile) {

            imageUrl =
                await uploadProductImage(
                    selectedImageFile
                );

        }


        const productData = {

            name:
                name,

            price:
                price,

            category:
                category,

            image_url:
                imageUrl,

            sizes:
                sizes || null,

            colors:
                colors || null,

            stock:
                stock,

            description:
                description || null,

            is_published:
                isPublished

        };


        /*
           UPDATE
        */

        if (editingProductId) {

            const {
                data,
                error
            } =
                await supabaseClient
                    .from("products")
                    .update(
                        productData
                    )
                    .eq(
                        "id",
                        editingProductId
                    )
                    .select()
                    .single();


            if (error) {

                throw error;

            }


            /*
               Delete old i
