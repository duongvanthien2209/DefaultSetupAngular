async function handleCartSubmit(evt) {
  evt.preventDefault();

  // debugger;

  // Taọ mới cart
  let cart = await axios({
    method: "POST",
    url: `/cart`,
    baseURL: "http://localhost:4000/",
    data: { status: "Đã xác nhận giỏ hàng" },
  });

  window.location.href = `/info-person.html?_cardId=${cart.data.id}`;
}

window.addEventListener("DOMContentLoaded", (event) => {
  // Loading giỏ hàng
  let cart = JSON.parse(localStorage.getItem("cart"));
  if (cart && cart.length > 0) {
    renderCart(cart, true, true);

    let btnCartSubmit = document.getElementById("btn-cart-submit");
    btnCartSubmit.addEventListener("click", handleCartSubmit);
  } else {
    // Check có sản phẩm trong giỏ hàng
    window.location.replace("/404.html");
  }
});
