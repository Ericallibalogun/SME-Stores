// js/product.js

const detailEl = document.getElementById("productDetail");

// Get ID from query string
function getProductId() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get("id");
}

function addToCart(productId) {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const item = cart.find((p) => p.id === productId);
  if (item) {
    item.qty += 1;
  } else {
    cart.push({ id: productId, qty: 1 });
  }
  localStorage.setItem("cart", JSON.stringify(cart));
  alert("Product added to cart!");
}

// Render product details
function renderProduct(product) {
  detailEl.innerHTML = `
    <img src="${product.thumbnail}" alt="${product.title}" />
    <h2>${product.title}</h2>
    <p><strong>Brand:</strong> ${product.brand}</p>
    <p><strong>Category:</strong> ${product.category}</p>
    <p>${product.description}</p>
    <p class="price">$${product.price}</p>
    <p>⭐ ${product.rating}</p>
    <button onclick="addToCart(${product.id})">Add to Cart</button>
  `;
}

// Init
async function init() {
  const id = getProductId();
  if (!id) {
    detailEl.innerHTML = "<p>Product ID not found.</p>";
    return;
  }

  try {
    const product = await window.api.fetchProductById(id);
    renderProduct(product);
  } catch (e) {
    detailEl.innerHTML = "<p>Failed to load product details.</p>";
  }
}

init();
