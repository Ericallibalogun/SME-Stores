// js/index.js

const productListEl = document.getElementById("productList");
const categoriesEl = document.getElementById("categories");
const searchInput = document.getElementById("searchInput");

let allProducts = [];

// Initial load function
async function init() {
  try {
    allProducts = await window.api.fetchProducts();
    const categories = await window.api.fetchCategories();

    renderCategories(categories);
    renderProducts(allProducts); // ✅ This should run automatically on load
  } catch (error) {
    console.error("Error loading products or categories:", error);
    productListEl.innerHTML = "<p>Failed to load products.</p>";
  }
}

// Render category filter buttons
function renderCategories(categories) {
  categoriesEl.innerHTML = "";

  const allBtn = document.createElement("button");
  allBtn.textContent = "All";
  allBtn.onclick = () => renderProducts(allProducts);
  categoriesEl.appendChild(allBtn);

  categories.forEach((cat) => {
    const btn = document.createElement("button");
    btn.textContent = cat.name; // Proper label (e.g., "Beauty")
    btn.onclick = () => {
      const filtered = allProducts.filter((p) => p.category === cat.slug); // Filtering using 'slug'
      renderProducts(filtered);
    };
    categoriesEl.appendChild(btn);
  });
}

// Render product grid
function renderProducts(products) {
  productListEl.innerHTML = "";
  if (!products.length) {
    productListEl.innerHTML = "<p>No products found.</p>";
    return;
  }

  products.forEach((product) => {
    const card = document.createElement("div");
    card.className = "product-card";

    card.innerHTML = `
      <img src="${product.thumbnail}" alt="${product.title}" />
      <h3><a href="product.html?id=${product.id}">${product.title}</a></h3>
      <p>${product.description.slice(0, 80)}...</p>
      <div class="price">$${product.price}</div>
      <div class="rating">⭐ ${product.rating}</div>
      <button onclick="addToCart(${product.id})">Add to Cart</button>
    `;

    productListEl.appendChild(card);
  });
}

// Search products
searchInput.addEventListener("input", (e) => {
  const query = e.target.value.toLowerCase();
  const filtered = allProducts.filter(
    (p) =>
      p.title.toLowerCase().includes(query) ||
      p.description.toLowerCase().includes(query) ||
      p.category.toLowerCase().includes(query)
  );
  renderProducts(filtered);
});

// Add product to cart
function addToCart(productId) {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const item = cart.find((p) => p.id === productId);

  if (item) {
    item.qty += 1;
  } else {
    cart.push({ id: productId, qty: 1 });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  alert("Added to cart!");
}

// 🚀 Load products & categories on page load
init();
