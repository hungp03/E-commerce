const Product = require("../models/product");
const asyncHandler = require("express-async-handler");
const data = require("../../crawl-data/data2.json");
const slugify = require("slugify");
const categoryData = require("../../crawl-data/cate_brand");
const ProductCategory = require("../models/productCategory");

const fn = async (product) => {
  let color = null;
  if (
    product?.variants &&
    Array.isArray(product.variants) &&
    product.variants.length > 0
  ) {
    const colorVariant = product.variants.find((el) => el.label === "Color");
    if (
      colorVariant &&
      colorVariant.variants &&
      Array.isArray(colorVariant.variants) &&
      colorVariant.variants.length > 0
    ) {
      color = colorVariant.variants[0];
    }
  }

  await Product.create({
    title: product?.name,
    slug: slugify(product?.name) + Math.round(Math.random() * 100) + "",
    description: product?.description,
    brand: product?.brand,
    price: Math.round(Number(product?.price?.match(/\d/g).join("")) / 100),
    category: product?.category[1],
    quantity: Math.round(Math.random() * 300),
    sold: Math.round(Math.random() * 100),
    image: product?.image,
    color: color,
  });
};

const insertProduct = asyncHandler(async (req, res) => {
  const promises = [];
  for (let product of data) promises.push(fn(product));
  await Promise.all(promises);
  return res.json("done");
});

const fn2 = async (cate) => {
  await ProductCategory.create({
    title: cate?.cate,
    brand: cate?.brand,
  });
};

const insertCate = asyncHandler(async (req, res) => {
  const promises = [];
  for (let cate of categoryData) promises.push(fn2(cate));
  await Promise.all(promises);
  return res.json("done");
});

module.exports = { insertProduct, insertCate };
