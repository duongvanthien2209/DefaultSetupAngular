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

function handleChangeCartItem(element, productId) {
  let value = parseInt(element.value);
  let cart = JSON.parse(localStorage.getItem("cart"));
  if (cart) {
    if (value <= 0) {
      cart = cart.filter((item) => item.productId !== productId);
    } else {
      // console.log("111");
      let cartItem = cart.find((item) => item.productId === productId);
      console.log({ cartItem, value });
      if (cartItem.number !== value) {
        cartItem.number = value;
      }
    }
    // Cập nhật lại vào local storage
    localStorage.setItem("cart", JSON.stringify(cart));

    // Render lại
    renderCart(cart, true);
    // Render giỏ hàng
    renderCart(cart);
  }
}

async function renderCart(
  cart,
  isCartPage = false,
  isInfoCartPage = false,
  isComplete = false
) {
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
    <td class="font-weight-bold text-center text-uppercase align-middle border-bottom-0"><img class="img-70px-70px" src="${
      product.img
    }" alt=""></td>
    <td class="font-weight-bold text-center text-uppercase align-middle border-bottom-0">${
      product.title
    }</td>
    ${
      !isInfoCartPage
        ? `<td class="font-weight-bold text-center text-uppercase align-middle border-bottom-0">${parsePrice(
            product.price
          )} Đ</td>`
        : ""
    }
    ${
      isInfoCartPage || isComplete
        ? `<td class="font-weight-bold text-center text-uppercase align-middle border-bottom-0">${cartItem.number}</td>`
        : `<td class="font-weight-bold text-center text-uppercase align-middle border-bottom-0"> 
      <input class="form-control mx-auto" type="number" onChange="handleChangeCartItem(this, ${product.id})" value="${cartItem.number}">
    </td>`
    }
    <td class="font-weight-bold text-center text-danger text-uppercase align-middle border-bottom-0">${parsePrice(
      cartItem.number * product.price
    )} Đ</td>
    ${
      isInfoCartPage || isComplete
        ? ""
        : `<td class="font-weight-bold text-center text-uppercase align-middle border-bottom-0"><button class="btn btn-outline-danger" onClick="removeItemInCart(${product.id},true)"> <img src="./assets/images/close.svg" alt=""></button></td>`
    }
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
    let shoppingCartTotal = document.getElementById("shopping-cart-total");
    let shoppingCartTax = document.getElementById("shopping-cart-tax");
    let shoppingCartPay = document.getElementById("shopping-cart-pay");

    shoppingBody.innerHTML = str;
    shoppingCartTotal.innerText = `${total > 0 ? parsePrice(total) : 0} Đ`;
    shoppingCartTax.innerText = `${
      parseInt(0.05 * total) > 0 ? parsePrice(parseInt(0.05 * total)) : 0
    } Đ`;
    shoppingCartPay.innerText = `${
      parseInt(0.95 * total) > 0 ? parsePrice(parseInt(0.95 * total)) : 0
    } Đ`;
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

function removeItemInCart(productId, isCartPage = false) {
  let cart = JSON.parse(localStorage.getItem("cart"));
  if (cart) {
    cart = cart.filter((item) => item.productId !== productId);

    // Ghi vào local storage
    localStorage.setItem("cart", JSON.stringify(cart));

    if (isCartPage) renderCart(cart, isCartPage);
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
