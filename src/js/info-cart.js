window.addEventListener("DOMContentLoaded", (event) => {
  // Loading giỏ hàng
  let cart = JSON.parse(localStorage.getItem("cart"));
  if (cart) {
    renderCart(cart, true, true);
  }
});
