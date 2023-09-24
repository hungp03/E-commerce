const ProductCategory = require("../models/productCategory");
const asyncHandler = require("express-async-handler");

const createCategory = asyncHandler(async (req, res) => {
  const { title } = req.body;
  if (!title) {
    return res.status(400).json({
      success: false,
      message: "Missing input",
    });
  }
  const response = await ProductCategory.create(req.body);
  return res.status(200).json({
    success: response ? true : false,
    createdCategory: response ? response : "Cannot create new product category",
  });
});

const getCategories = asyncHandler(async (req, res) => {
  const response = await ProductCategory.find().select("title _id");
  return res.json({
    success: response ? true : false,
    categories: response ? response : "Cannot get categories",
  });
});

const updateCategory = asyncHandler(async (req, res) => {
  const { pcid } = req.params;
  const response = await ProductCategory.findByIdAndUpdate(pcid, req.body, {
    new: true,
  });
  return res.json({
    success: response ? true : false,
    updatedCategory: response ? response : "Cannot update category",
  });
});

const deleteCategory = asyncHandler(async (req, res) => {
  const { pcid } = req.params;
  const response = await ProductCategory.findByIdAndDelete(pcid);
  return res.json({
    success: response ? true : false,
    deletedCategory: response ? response : "Cannot delete category",
  });
});
module.exports = {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory,
};
