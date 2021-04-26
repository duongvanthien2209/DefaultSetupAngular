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
}

window.addEventListener("DOMContentLoaded", (event) => {
  let productId = parseInt(window.location.href.split("productId=")[1]);
  loadProductById(productId);
});
