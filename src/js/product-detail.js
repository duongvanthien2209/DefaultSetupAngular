let number = 0;

function handleChangeNumber(evt) {
  let value = +evt.target.value;
  if (value < 0) evt.target.value = 0;
  else number = value;
}

function handlePaySubmit(evt) {
  evt.preventDefault();
  if (!number) toastr.warning("Số lượng sản phẩm hiện tại là 0");
  else {
    let id = +evt.target.dataset.id;
    addToCart(id, number);
    window.location.href = "/shopping-cart.html";
  }
}

async function loadProductById(productId) {
  let { data: product } = await axios({
    method: "GET",
    url: `/products/${productId}`,
    baseURL: "http://localhost:4000/",
  });

  let img = document.getElementById("product-detail-img");
  let title = document.getElementById("product-detail-title");
  let stars = document.getElementById("product-detail-stars");
  let reviews = document.getElementById("product-detail-reviews");
  let price = document.getElementById("product-detail-price");
  let description = document.getElementById("product-detail-description");

  // Load dữ liệu và chi tiết product
  img.src = product.img;
  title.innerText = product.title;
  reviews.innerText = `${product.reviews} Đánh giá`;
  price.innerText = `GNY: ${parsePrice(product.price)} Đ`;
  description.innerText = product.description;
  // Stars
  let starStr = changeStars(product.star);
  stars.innerHTML = starStr;

  // Load id vao submit pay button
  let cartPaySubmitEl = document.getElementById("cart-pay");
  cartPaySubmitEl.dataset.id = product.id;
}

window.addEventListener("DOMContentLoaded", (event) => {
  let productId = parseInt(window.location.href.split("productId=")[1]);
  loadProductById(productId);

  let cartNumberInputEl = document.getElementById("cart-number-input");
  cartNumberInputEl.addEventListener("change", handleChangeNumber);
  let cartPaySubmitEl = document.getElementById("cart-pay");
  cartPaySubmitEl.addEventListener("click", handlePaySubmit);
});
