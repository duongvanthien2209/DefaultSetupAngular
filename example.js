const fs = require("fs");

const categories = [
  { id: 1, name: "Sản phẩm 1" },
  { id: 2, name: "Sản phẩm 2" },
  { id: 3, name: "Sản phẩm 3" },
  { id: 4, name: "Sản phẩm 4" },
  { id: 5, name: "Sản phẩm 5" },
  { id: 6, name: "Sản phẩm 6" },
];

fs.readFile("./db.json", { encoding: "utf-8" }, (err, data) => {
  // let { products, categories } = JSON.parse(data);
  // console.log({ products, categories });

  let { products } = JSON.parse(data);
  // console.log({ products, categories });
  for (let product of products) {
    let index = 1 + Math.floor(Math.random() * 12);
    // product.category = categories[index].id;
    product.img = `./assets/images/products/${index}.png`;
  }
  fs.writeFile("./db.json", JSON.stringify({ categories, products }), () =>
    console.log("Done")
  );
});
