function parsePrice(price) {
  let result = "";
  let dem = 1;
  while (price > 0) {
    let so = price % 10;
    if (dem === 3) {
      result = `.${so}` + result;
      dem = 0;
    } else result = so + result;
    dem++;

    price = parseInt(price / 10);
  }

  if (result[0] === ".") return result.slice(1);
  else return result;
}

function changeStars(stars) {
  let starStr = "";
  for (let i = 1; i <= 5; i++) {
    starStr +=
      i <= stars
        ? '<li><i class="fas fa-star"></i></li>'
        : '<li><i class="far fa-star"></i></li>';
  }
  return starStr;
}

async function renderCart(cart, isCartPage = false) {
  let total = 0;
  let str = "";
  let index = 0;
  for (let cartItem of cart) {
    let { data: product } = await axios({
      method: "GET",
      url: `/products/${cartItem.productId}`,
      baseURL: "http://localhost:4000/",
    });

    str += isCartPage
      ? `<tr>
    <td class="font-weight-bold text-center text-uppercase align-middle border-bottom-0">${++index}</td>
    <td class="font-weight-bold text-center text-uppercase align-middle border-bottom-0"><img src="${
      product.img
    }" alt=""></td>
    <td class="font-weight-bold text-center text-uppercase align-middle border-bottom-0">${
      product.title
    }</td>
    <td class="font-weight-bold text-center text-uppercase align-middle border-bottom-0">${parsePrice(
      product.price
    )} Đ</td>
    <td class="font-weight-bold text-center text-uppercase align-middle border-bottom-0"> 
      <input class="form-control mx-auto" type="number" placeholder="${
        cartItem.number
      }">
    </td>
    <td class="font-weight-bold text-center text-uppercase align-middle border-bottom-0">${parsePrice(
      cartItem.number * product.price
    )} Đ</td>
    <td class="font-weight-bold text-center text-uppercase align-middle border-bottom-0"><a href="#"> <img src="./assets/images/close.svg" alt=""></a></td>
  </tr>`
      : `<div class="cart-item${
          index++ < cart.length ? " border-bottom" : ""
        }"><img src="${product.img}" alt="">
      <div class="cart-item__content text-center mx-2">
        <p class="cart-item__content__title text-uppercase">${product.title}</p>
        <p>
          ${cartItem.number} x  <span>${parsePrice(product.price)} Đ</span></p>
      </div><button class="btn btn-outline-danger" onClick="removeItemInCart(${
        product.id
      })"> <i class="far fa-times-circle"> </i></button>
    </div>`;
    total += product.price * cartItem.number;
  }

  if (!isCartPage) {
    let cartNumber = document.getElementById("cart-number");
    let cartItem = document.getElementById("cart-items");
    let cartTotal = document.getElementById("cart-total");

    cartNumber.innerText = cart.length;
    cartTotal.innerText = `${!total ? 0 : parsePrice(total)}Đ`;
    cartItem.innerHTML = str;
  } else {
    let shoppingBody = document.getElementById("cart-shopping-body");
    shoppingBody.innerHTML = str;
  }
}

function addToCart(productId, number) {
  // Thêm vào local storage
  let cart = JSON.parse(localStorage.getItem("cart"));
  if (cart) {
    // Kiểm tra xem productId có trùng ko -> nếu trùng thì cộng thêm vào
    let cartItem = cart.find((item) => item.productId === productId);
    if (cartItem) cartItem.number += number;
    else cart.push({ productId, number });
  } else cart = [{ productId, number }];
  localStorage.setItem("cart", JSON.stringify(cart));

  // Thêm vào giỏ hàng
  renderCart(cart);
}

function removeItemInCart(productId) {
  let cart = JSON.parse(localStorage.getItem("cart"));
  if (cart) {
    cart = cart.filter((item) => item.productId !== productId);

    // Ghi vào local storage
    localStorage.setItem("cart", JSON.stringify(cart));

    renderCart(cart);
  }
}

window.addEventListener("DOMContentLoaded", (event) => {
  // Kiểm tra giỏ hàng
  let cart = JSON.parse(localStorage.getItem("cart"));
  if (cart) {
    renderCart(cart);
  }
});
