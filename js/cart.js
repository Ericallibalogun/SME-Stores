// js/cart.js

const cartContainer = document.getElementById("cartContainer");

async function loadCart() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  if (cart.length === 0) {
    cartContainer.innerHTML = "<p>Your cart is empty.</p>";
    return;
  }

  // Fetch all product data
  const productPromises = cart.map((item) =>
    window.api.fetchProductById(item.id).then((product) => ({
      ...product,
      qty: item.qty,
    }))
  );
  const products = await Promise.all(productPromises);

  renderCart(products);
}

// Render all items
function renderCart(products) {
  cartContainer.innerHTML = "";
  let total = 0;

  products.forEach((product) => {
    total += product.price * product.qty;

    const itemEl = document.createElement("div");
    itemEl.className = "cart-item";
    itemEl.innerHTML = `
      <img src="${product.thumbnail}" alt="${product.title}" />
      <div class="cart-item-info">
        <h3>${product.title}</h3>
        <p>$${product.price} x ${product.qty}</p>
      </div>
      <div class="cart-item-controls">
        <button onclick="changeQty(${product.id}, -1)">-</button>
        <span>${product.qty}</span>
        <button onclick="changeQty(${product.id}, 1)">+</button>
        <button onclick="removeItem(${product.id})" style="background:#dc3545;">🗑</button>
      </div>
    `;
    cartContainer.appendChild(itemEl);
  });

  const totalEl = document.createElement("div");
  totalEl.className = "total";
  totalEl.innerHTML = `
    <p>Total: $${total.toFixed(2)}</p>
    <button onclick="window.location.href='checkout.html'" style="margin-top: 1rem; padding: 0.6rem 1rem; background:#0077cc; color:white; border:none; border-radius:8px; cursor:pointer;">Proceed to Checkout</button>
  `;
  cartContainer.appendChild(totalEl);
}

// Change quantity
function changeQty(productId, delta) {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const item = cart.find((p) => p.id === productId);
  if (!item) return;

  item.qty += delta;
  if (item.qty <= 0) {
    const index = cart.indexOf(item);
    cart.splice(index, 1);
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  loadCart();
}

// Remove item
function removeItem(productId) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart = cart.filter((p) => p.id !== productId);
  localStorage.setItem("cart", JSON.stringify(cart));
  loadCart();
}

// Init
loadCart();
