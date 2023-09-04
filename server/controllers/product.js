const { query } = require("express");
const Product = require("../models/product");
const asyncHandler = require("express-async-handler");
const slugify = require("slugify");

const createProduct = asyncHandler(async (req, res) => {
  if (!Object.keys(req.body).length) {
    throw new Error("Missing input");
  }
  if (req.body && req.body.title) {
    req.body.slug = slugify(req.body.title);
  }
  const newProduct = await Product.create(req.body);
  return res.status(200).json({
    success: newProduct ? true : false,
    createdProduct: newProduct ? newProduct : "Cannot create new product",
  });
});

const getProduct = asyncHandler(async (req, res) => {
  const { pid } = req.params;
  const product = await Product.findById(pid);
  return res.status(200).json({
    success: product ? true : false,
    product: product ? product : "Product not found!",
  });
});

//Filtering, sorting and oagination
//https://jeffdevslife.com/p/1-mongodb-query-of-advanced-filtering-sorting-limit-field-and-pagination-with-mongoose/
const getProducts = asyncHandler(async (req, res) => {
  const queries = { ...req.query };
  //tách các trường đặc biệt ra khỏi query
  const excludeFields = ["limit", "sort", "page", "fields"];
  excludeFields.forEach((el) => delete queries[el]);
  //Format lại các operators cho đúng cú pháp Mongoose
  let queryString = JSON.stringify(queries);
  queryString = queryString.replace(
    /\b(gt|gte|lt|lte)\b/g,
    (matchedElement) => `$${matchedElement}`
  );
  const formatedQueries = JSON.parse(queryString);

  //Filtering
  if (queries?.title)
    formatedQueries.title = { $regex: queries.title, $options: "i" };
  //không dùng await => pending để xử lý các lệnh
  let queryCommand = Product.find(formatedQueries);

  //Sorting
  if (req.query.sort){
    //Split: abc,efg => [abc, efg] => join => [abc efg]
    const sortBy = req.query.sort.split(',').join(' ')
    queryCommand = queryCommand.sort(sortBy)
  }
  //Moongoose 7 trở lên không hỗ trợ callback function trong exec()
  /*queryCommand.exec(async(err, response)=>{
    if (err) throw new Error(err.message);
    const counts = await Product.find(formatedQueries).countDocuments();
    return res.status(200).json({
      success: products ? true : false,
      products: products ? products : "No data",
      counts 
    });
  })
  */
  //excute query
  //số lượng sp thỏa điều kiện !== số lượng sp mà API gọi ra
  queryCommand
    .then(async (response) => {
      const counts = await Product.find(formatedQueries).countDocuments();
      return res.status(200).json({
        success: counts ? true : false,
        products: response.length ? response : "No data",
        counts,
      });
    })
    .catch((err) => {
      throw new Error(err.message);
    });
});

const updateProduct = asyncHandler(async (req, res) => {
  const { pid } = req.params;
  if (!Object.keys(req.body).length) throw new Error("Missing input");
  if (req.body && req.body.title) {
    req.body.slug = slugify(req.body.title);
  }
  const updatedProduct = await Product.findByIdAndUpdate(pid, req.body, {
    new: true,
  });
  return res.status(200).json({
    success: updateProduct ? true : false,
    updated: updatedProduct ? updatedProduct : "No data updated",
  });
});

const deleteProduct = asyncHandler(async (req, res) => {
  const { _id } = req.query;
  if (!_id) throw new Error("Missing input");
  const response = await Product.findByIdAndDelete(_id);
  return res.status(200).json({
    success: response ? true : false,
    deletedUser: response ? `Deleted ${response.title}` : "No product deleted",
  });
});

module.exports = {
  createProduct,
  getProduct,
  getProducts,
  updateProduct,
  deleteProduct,
};
