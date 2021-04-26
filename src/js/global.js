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
