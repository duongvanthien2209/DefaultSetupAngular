window.addEventListener("DOMContentLoaded", (event) => {
  // debugger;
  let cart = JSON.parse(localStorage.getItem("cart"));
  if (cart) {
    renderCart(cart, true);
  }
});
