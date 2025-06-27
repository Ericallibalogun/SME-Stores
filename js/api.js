// js/api.js

const API_BASE = "https://dummyjson.com";

async function fetchProducts() {
  const res = await fetch(`${API_BASE}/products`);
  const data = await res.json();
  return data.products;
}

async function fetchCategories() {
  const res = await fetch(`${API_BASE}/products/categories`);
  const data = await res.json();
  console.log("Fetched categories:", data);
  return data;
}

async function fetchProductById(id) {
  const res = await fetch(`${API_BASE}/products/${id}`);
  const data = await res.json();
  return data;
}

// Expose API functions globally
window.api = {
  fetchProducts,
  fetchCategories,
  fetchProductById,
};
