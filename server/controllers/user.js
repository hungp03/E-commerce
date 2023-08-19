const User = require("../models/user");
const asyncHandler = require("express-async-handler");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../middleware/jwt");

//Register
const register = asyncHandler(async (req, res) => {
  const { email, password, firstname, lastname } = req.body;
  //kiểm tra trước để giảm tải cho db
  if (!email || !password || !lastname || !firstname) {
    return res.status(400).json({
      success: false,
      message: "Missing input",
    });
  }
  const user = await User.findOne({ email });
  if (user) throw new Error("User already existed!");
  else {
    const newUser = await User.create(req.body);
    return res.status(200).json({
      success: newUser ? true : false,
      message: newUser ? "Register successfull" : "Something went wrong",
    });
  }
});

//Login
//RefreshToken: cấp mới AccessToken
//AccessToken: Xác thực, phân quyền người dùng
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  //kiểm tra trước đầu vào để giảm tải cho DB
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Missing input",
    });
  }
  const response = await User.findOne({ email });
  //console.log(response.isCorrectPassword(password))
  //Đợi hàm check pw => await
  if (response && (await response.isCorrectPassword(password))) {
    //toObject: convert MongoObject to plain Object, to use Destructuring and rest operator
    //Tách passwỏd và role ra khỏi response
    const { password, role, ...userData } = response.toObject();
    //Tạo accessToken
    const accessToken = generateAccessToken(response._id, role);
    //Tạo RefreshToken
    const refreshToken = generateRefreshToken(response._id);
    //Lưu refreshToken vào DB
    await User.findOneAndUpdate(response._id, { refreshToken }, { new: true });
    //Lưu refreshToken vào cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 864000000,
    });
    return res.status(200).json({
      success: true,
      accessToken,
      userData,
    });
  } else {
    throw new Error("Invalid credentials!");
  }
});

const getCurrentUser = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  //Dùng select trong mongo để chọn những field cần lấy, thêm dấu '-' để ẩn
  const user = await User.findById(_id).select('-refreshToken -password -role');
  return res.status(200).json({
    success: false,
    result: user ? user : "user not found",
  });
});
module.exports = {
  register,
  login,
  getCurrentUser,
};
