const productsContainer =
    document.getElementById("products-container");


// Get cart from localStorage

let cart =
    JSON.parse(localStorage.getItem("cart")) || [];


// Save cart

function saveCart() {

    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );

}


// Update cart UI

function updateCartUI() {

    // Total number of products

    let cartCount = cart.reduce(
        (sum, item) => sum + item.quantity,
        0
    );

    document.getElementById("cart-count").innerText =
        cartCount;


    const cartItems =
        document.getElementById("cart-items");

    const cartTotal =
        document.getElementById("cart-total");


    cartItems.innerHTML = "";


    // Empty cart

    if (cart.length === 0) {

        cartItems.innerHTML =
            "<p>Your cart is empty.</p>";

        cartTotal.innerText =
            "Total: $0.00";

        return;
    }


    let total = 0;


    // Display cart items

    cart.forEach(item => {

        total +=
            item.price * item.quantity;


        const cartItem =
            document.createElement("div");

        cartItem.className =
            "cart-item";


        cartItem.innerHTML = `

            <img
                src="${item.image}"
                alt="${item.title}"
            >

            <div class="cart-item-info">

                <h3>
                    ${item.title}
                </h3>

                <p>
                    $${item.price.toFixed(2)}
                    ×
                    ${item.quantity}
                </p>

                <div class="cart-controls">

                    <button
                        onclick="changeCartQuantity(${item.id}, -1)"
                    >
                        −
                    </button>

                    <span>
                        ${item.quantity}
                    </span>

                    <button
                        onclick="changeCartQuantity(${item.id}, 1)"
                    >
                        +
                    </button>

                    <button
                        class="remove-btn"
                        onclick="removeFromCart(${item.id})"
                    >
                        Remove
                    </button>

                </div>

            </div>
        `;


        cartItems.appendChild(cartItem);

    });


    // Total price

    cartTotal.innerText =
        "Total: $" + total.toFixed(2);

}


// Add product to cart

function addToCart(product) {

    const existing =
        cart.find(item => item.id === product.id);


    if (existing) {

        existing.quantity++;

    } else {

        cart.push({

            id: product.id,

            title: product.title,

            price: product.price,

            image: product.image,

            quantity: 1

        });

    }


    saveCart();

    updateCartUI();

}


// Change quantity

function changeCartQuantity(id, amount) {

    const item =
        cart.find(item => item.id === id);


    if (!item) return;


    item.quantity += amount;


    if (item.quantity <= 0) {

        cart =
            cart.filter(item => item.id !== id);

    }


    saveCart();

    updateCartUI();

}


// Remove product

function removeFromCart(id) {

    cart =
        cart.filter(item => item.id !== id);


    saveCart();

    updateCartUI();

}


// Open cart

document
    .getElementById("cart-button")
    .addEventListener("click", function () {

        document
            .getElementById("cart-sidebar")
            .classList.add("open");

    });


// Close cart

document
    .getElementById("close-cart")
    .addEventListener("click", function () {

        document
            .getElementById("cart-sidebar")
            .classList.remove("open");

    });


// Fetch products

fetch("https://fakestoreapi.com/products")

    .then(response => response.json())

    .then(products => {

        products.forEach(product => {

            const div =
                document.createElement("div");


            // Image

            const img =
                document.createElement("img");

            img.src = product.image;

            img.alt = product.title;


            // Title

            const title =
                document.createElement("h1");

            title.innerText =
                product.title;


            // Price

            const price =
                document.createElement("h2");

            price.innerText =
                "$" + product.price.toFixed(2);


            // Quantity

            let quantity = 0;


            // Plus button

            const incrementBtn =
                document.createElement("button");

            incrementBtn.innerText = "+";


            // Minus button

            const decrementBtn =
                document.createElement("button");

            decrementBtn.innerText = "-";


            // Add button

            const addItemBtn =
                document.createElement("button");

            addItemBtn.innerText =
                "ADD TO CART";

            addItemBtn.className =
                "add-btn";


            // Add to cart

            addItemBtn.addEventListener(
                "click",
                function () {

                    addToCart(product);

                    quantity++;

                    addItemBtn.innerText =
                        "ADDED ✓";

                }
            );


            // Plus

            incrementBtn.addEventListener(
                "click",
                function () {

                    quantity++;

                    addItemBtn.innerText =
                        "Added: " + quantity;

                }
            );


            // Minus

            decrementBtn.addEventListener(
                "click",
                function () {

                    if (quantity > 0) {

                        quantity--;

                        if (quantity === 0) {

                            addItemBtn.innerText =
                                "ADD TO CART";

                        } else {

                            addItemBtn.innerText =
                                "Added: " + quantity;

                        }

                    }

                }
            );


            // Add everything to card

            div.appendChild(img);

            div.appendChild(title);

            div.appendChild(price);

            div.appendChild(incrementBtn);

            div.appendChild(decrementBtn);

            div.appendChild(addItemBtn);


            productsContainer.appendChild(div);

        });


        // Show saved cart

        updateCartUI();

    })


    .catch(error => {

        console.log(
            "Error:",
            error
        );

        productsContainer.innerHTML =
            "<p>Failed to load products.</p>";

    });