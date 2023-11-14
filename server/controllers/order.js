const Order = require("../models/order");
const asyncHandler = require("express-async-handler");
const User = require("../models/user");
const Coupon = require("../models/coupon");
const createNewOrder = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { coupon } = req.body;
  const userCart = await User.findById(_id)
    .select("cart")
    .populate("cart.product", "title price");
  const products = userCart?.cart?.map((el) => ({
    product: el.product._id,
    count: el.quantity,
    color: el.color,
  }));
  let total = userCart?.cart?.reduce(
    (sum, el) => el.product.price * el.quantity + sum,
    0
  );
  const createData = {products, total, orderBy: _id}
  //Nếu có coupon, tính giảm giá theo coupon
  if (coupon) {
    const selectedCoupon = await Coupon.findById(coupon);
    total = Math.round((total = (total * (1 - selectedCoupon.discount / 100)) / 1000)) *1000 || total;
    createData.total = total
    createData.coupon = coupon
}
  const rs = await Order.create(createData);
  return res.json({
    success: rs ? true : false,
    result: rs ? rs : "Something went wrong",
  });
});

const updateStatus = asyncHandler(async (req, res) => {
  const { oid } = req.params;
  const { status } = req.body;
  if (!status) {
    throw new Error("Missing status");
  }
  const rs = await Order.findByIdAndUpdate(oid, { status }, { new: true });
  return res.json({
    success: rs ? true : false,
    result: rs ? rs : "Something went wrong",
  });
});

const getUserOrder = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const rs = await Order.find({ orderBy: _id });
  return res.json({
    success: rs ? true : false,
    result: rs ? rs : "Something went wrong",
  });
});

const getOrderByAdmin = asyncHandler(async (req, res) => {
    const rs = await Order.find();
    return res.json({
      success: rs ? true : false,
      result: rs ? rs : "Something went wrong",
    });
  });
module.exports = {
  createNewOrder,
  updateStatus,
  getUserOrder,
  getOrderByAdmin
};
