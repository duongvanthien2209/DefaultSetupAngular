let obj = {
  name: "",
  email: "",
  phone: "",
  address: "",
  note: "",
  payMethod: "Tiền mặt",
};

let cardId;

// Errors [{ case: '', message: '' }]
function checkError(inputElement, errors, property) {
  let value = inputElement.value;
  let label = inputElement.nextElementSibling;
  let str = "";

  for (let error of errors) {
    if (!str) {
      switch (error.case) {
        case "not null":
          if (value === "") str = error.message;
          break;
        case "min 10":
          if (value.length <= 10) str = error.message;
          break;
        case "is 10":
          if (value.length !== 10) str = error.message;
          break;
        case "is email":
          if (value.indexOf("@gmail.com") < 1) str = error.message;
          break;
        case "is phone number":
          let regex = /[^0-9]/;
          if (regex.test(value)) str = error.message;
          break;
      }
    }
  }

  if (str) {
    inputElement.style.borderColor = "#dc3545";
    label.textContent = str;
    if (label.classList.contains("d-none")) {
      label.classList.remove("d-none");
    }
  } else {
    inputElement.style.borderColor = "#ced4da";
    if (!label.classList.contains("d-none")) {
      label.classList.add("d-none");
    }

    // if (!obj.name) obj.name = value;
    // if (!obj.email) obj.email = value;
    // if (!obj.phone) obj.phone = value;
    // if (!obj.address) obj.address = value;

    if (value) obj[property] = value;

    // console.log(obj);
  }
}

function handleNote(evt) {
  let value = evt.target.value;
  obj.note = value;
}

function handlePayMethod(evt) {
  let value = evt.target.value;
  obj.payMethod = value;
}

async function handleSubmit(
  evt,
  nameInput,
  emailInput,
  phoneInput,
  addressInput,
  obj
) {
  evt.preventDefault();

  if (!cardId) return toastr.error("Có lỗi xảy ra");

  if (!obj.name || !obj.email || !obj.phone || !obj.address) {
    // Check not null
    checkError(
      nameInput,
      [{ case: "not null", message: "Bạn không được để trống" }],
      obj
    );
    checkError(
      emailInput,
      [{ case: "not null", message: "Bạn không được để trống" }],
      obj
    );
    checkError(
      phoneInput,
      [{ case: "not null", message: "Bạn không được để trống" }],
      obj
    );
    checkError(
      addressInput,
      [{ case: "not null", message: "Bạn không được để trống" }],
      obj
    );
  } else {
    let icon = document.createElement("i");
    icon.classList.add("fas");
    icon.classList.add("fa-spinner");
    icon.classList.add("fa-spin");
    icon.classList.add("text-danger");
    icon.classList.add("ml-2");
    evt.target.appendChild(icon);

    // debugger;
    // Tạo cart - lưu thông tin người dùng
    let cart = JSON.parse(localStorage.getItem("cart"));

    let now = new Date();
    let datestr = now
      .toLocaleString("en-GB", { timeZone: "UTC" })
      .split(",")[0];

    let cartItem = {
      products: [...cart],
      person: { ...obj },
      dateCreate: datestr,
      status: "Đã xác nhận thông tin",
    };

    if (obj.note) {
      cartItem.person.note = obj.note;
    }

    let result = await axios({
      method: "PATCH",
      url: `/cart/${cardId}`,
      baseURL: "http://localhost:4000/",
      data: cartItem,
    });

    let {
      data: { id: cartId },
    } = result;

    // Xét default giỏ hàng
    localStorage.setItem("cart", JSON.stringify([]));

    setTimeout(() => {
      // Chuyển trang
      window.location.href = `http://localhost:3000/complete-cart.html?_cardId=${cartId}`;
    }, 3000);
  }
}

window.addEventListener("DOMContentLoaded", async (event) => {
  // Check card ID
  let id = window.location.href.split("_cardId=")[1];

  if (!id) return (window.location.href = "/404.html");
  else {
    let cart = await axios({
      method: "GET",
      url: `/cart/${id}`,
      baseURL: "http://localhost:4000/",
    });

    if (!cart || (cart && cart.data.status !== "Đã xác nhận giỏ hàng")) {
      return (window.location.href = "/404.html");
    } else cardId = cart.data.id;
  }

  // Check lỗi
  let nameInput = document.getElementById("name");
  nameInput.addEventListener("keyup", (evt) =>
    checkError(
      evt.target,
      [
        { case: "not null", message: "Bạn không được để trống" },
        { case: "min 10", message: "Tên phải nhiều hơn 10 ký tự" },
      ],
      "name"
    )
  );

  let emailInput = document.getElementById("email");
  emailInput.addEventListener("keyup", (evt) =>
    checkError(
      evt.target,
      [
        { case: "not null", message: "Bạn không được để trống" },
        { case: "is email", message: "Bạn phải nhập đúng định dạng email" },
      ],
      "email"
    )
  );

  let phoneInput = document.getElementById("phone");
  phoneInput.addEventListener("keyup", (evt) =>
    checkError(
      evt.target,
      [
        { case: "is phone number", message: "Số điện thoại chỉ có chữ số" },
        { case: "is 10", message: "Số điện thoại bắt buộc phải có 10 chữ số" },
      ],
      "phone"
    )
  );

  let addressInput = document.getElementById("address");
  addressInput.addEventListener("keyup", (evt) =>
    checkError(
      evt.target,
      [{ case: "not null", message: "Bạn phải nhập địa chỉ" }],
      "address"
    )
  );

  let noteInput = document.getElementById("note");
  noteInput.addEventListener("keyup", handleNote);

  // Handle Submit
  // Tạo cart - check tất cả các trường
  let btnSubmit = document.getElementById("btn-submit");
  btnSubmit.addEventListener("click", (evt) =>
    handleSubmit(evt, nameInput, emailInput, phoneInput, addressInput, obj)
  );

  let radioInputs = document.querySelectorAll("input[type='radio']");
  for (let radioInput of radioInputs) {
    radioInput.addEventListener("change", handlePayMethod);
  }
});
