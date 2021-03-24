async function loadData() {
  let cartId = window.location.href.split("?cardId=")[1];

  let {
    data: { dateCreate, id, person, products },
  } = await axios({
    method: "GET",
    url: `/cart/${cartId}`,
    baseURL: "http://localhost:4000/",
  });

  // Render cart
  renderCart(products, true, false, true);

  let billIdEl = document.getElementById("bill-id");
  let dateBillEl = document.getElementById("bill-date");
  let personNameEl = document.getElementById("person-name");
  let personEmailEl = document.getElementById("person-email");
  let personAddEl = document.getElementById("person-address");
  let billPayMethodEl = document.getElementById("bill-paymethod");
  let billNoteEl = document.getElementById("bill-note");

  billIdEl.innerText = id;
  dateBillEl.innerText = dateCreate;
  personNameEl.innerText = person.name;
  personEmailEl.innerText = person.email;
  personAddEl.innerText = person.address;
  billPayMethodEl.innerText = person.payMethod;
  if (person.note) billNoteEl.innerText = person.note;
}

window.addEventListener("DOMContentLoaded", (event) => {
  loadData();
});
