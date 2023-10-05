const Brand = require("../models/brand");
const asyncHandler = require("express-async-handler");

const createBrand = asyncHandler(async (req, res) => {
  const { title } = req.body;
  if (!title) {
    return res.status(400).json({
      success: false,
      message: "Missing input",
    });
  }
  const response = await Brand.create(req.body);
  return res.status(200).json({
    success: response ? true : false,
    createdBrand: response || "Cannot create new brand",
  });
});

const getBrands = asyncHandler(async (req, res) => {
  const response = await Brand.find()
  return res.json({
    success: response ? true : false,
    brands: response || "Cannot get brands",
  });
});

const updateBrand = asyncHandler(async (req, res) => {
  const { brid } = req.params;
  const response = await Brand.findByIdAndUpdate(brid, req.body, {
    new: true,
  });
  return res.json({
    success: response ? true : false,
    updatedBrand: response || "Cannot update blog category",
  });
});

const deleteBrand = asyncHandler(async (req, res) => {
  const { brid } = req.params;
  const response = await Brand.findByIdAndDelete(brid);
  return res.json({
    success: response ? true : false,
    deletedBrand: response || "Cannot delete blog category",
  });
});
module.exports = {
  createBrand,
  getBrands,
  updateBrand,
  deleteBrand,
};
