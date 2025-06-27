// js/checkout.js

const container = document.getElementById("checkoutContainer");

async function loadCheckout() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  if (cart.length === 0) {
    container.innerHTML =
      "<p>Your cart is empty. <a href='index.html'>Go shopping</a>.</p>";
    return;
  }

  const productData = await Promise.all(
    cart.map((item) =>
      window.api.fetchProductById(item.id).then((product) => ({
        ...product,
        qty: item.qty,
      }))
    )
  );

  renderCheckout(productData);
}

function renderCheckout(products) {
  container.innerHTML = "";
  let total = 0;

  products.forEach((product) => {
    const subtotal = product.price * product.qty;
    total += subtotal;

    const item = document.createElement("div");
    item.className = "checkout-item";
    item.innerHTML = `
      <img src="${product.thumbnail}" />
      <div class="checkout-info">
        <h4>${product.title}</h4>
        <p>$${product.price} x ${product.qty} = <strong>$${subtotal}</strong></p>
      </div>
    `;
    container.appendChild(item);
  });

  const summary = document.createElement("div");
  summary.className = "checkout-summary";
  summary.textContent = `Total: $${total.toFixed(2)}`;
  container.appendChild(summary);

  const placeOrderBtn = document.createElement("button");
  placeOrderBtn.textContent = "Place Order";
  placeOrderBtn.onclick = () => {
    localStorage.removeItem("cart");
    container.innerHTML = `<p class="success-message">✅ Order placed successfully!</p>
    <p style="text-align:center;"><a href="index.html">Back to home</a></p>`;
  };
  container.appendChild(placeOrderBtn);
}

loadCheckout();
