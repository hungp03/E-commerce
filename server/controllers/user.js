const User = require("../models/user");
const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const sendMail = require("../utils/sendMail");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../middleware/jwt");

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
  const user = await User.findById(_id).select("-refreshToken -password -role");
  return res.status(200).json({
    success: false,
    result: user ? user : "user not found",
  });
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  //Lấy token từ cookies
  const cookie = req.cookies;
  //Kiểm tra xem có RF token hay không
  if (!cookie && !cookie.refreshToken)
    throw new Error("No RF token in cookies");
  //Kiểm tra RF token có hợp lệ hay không
  const result = await jwt.verify(cookie.refreshToken, process.env.JWT_SECRET);
  const response = await User.findOne({
    _id: result._id,
    refreshToken: cookie.refreshToken,
  });
  res.status(200).json({
    success: response ? true : false,
    newAccessToken: response
      ? generateAccessToken(response._id, response.role)
      : "Refresh token not matched",
  });
  //Can't throw Error when RF token expired
  /* jwt.verify(cookie.refreshToken, process.env.JWT_SECRET, async (err, decode) => {
      if (err) throw new Error("Invalid RF token");
      //Check xem có trùng RF token với DB không
      const response = await User.findOne({_id: decode._id, refreshToken: cookie.refreshToken,});
      res.status(200).json({
        success: response ? true : false,
        newAccessToken: response ? generateAccessToken(response._id, response.role) : "Refresh token not matched",
      });
    });*/
});

const logout = asyncHandler(async (req, res) => {
  //Lấy cookies
  const cookie = req.cookies;
  //Kiểm tra có RF token hay không (đang ở trạng thái đăng nhập hay không)
  if (!cookie || !cookie.refreshToken)
    throw new Error("No RF token in cookies");
  //Xóa RF token trong DB trùng với RF token trên browser
  await User.findOneAndUpdate(
    { refreshToken: cookie.refreshToken },
    { refreshToken: "" },
    { new: true }
  );
  //Xóa RF token trong cookies của browser
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: true,
  });
  return res.status(200).json({
    success: true,
    message: "Logout done",
  });
});

//Reset password
/*Client gửi email
Server check mail có hợp lệ không, nếu có thì gửi mail kèm link reset
Client gửi api kèm token
Check token xem có giống token mail gửi không*/
const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.query;
  if (!email) throw new Error("Missing Email");
  const user = await User.findOne({ email });
  if (!user) throw new Error("User not found");
  const resetToken = user.createPasswordChangeToken();
  //khi sd hàm tự tạo trong mongo, phải lưu thủ công
  await user.save();
  const html = `Please click on the link below to change/reset your password.This link will expire after 15 minutes from now <a href="${process.env.URL_SERVER}/api/user/resetpassword/${resetToken}">Click here</a>`;
  const data = {
    email,
    html,
  };
  const result = await sendMail(data);
  return res.status(200).json({
    success: true,
    result,
  });
});

const resetPassword = asyncHandler(async (req, res) => {
  const { password, token } = req.body;
  if (!token || !password) throw new Error('Missing input')
  const passwordResetToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");
  const user = await User.findOne({
    passwordResetToken,
    passwordResetExpires: { $gt: Date.now() },
  });
  if (!user) throw new Error("Invalid reset token");
  user.password = password;
  user.passwordResetToken = undefined;
  user.passwordChangeAt = Date.now();
  user.passwordResetExpires = undefined;
  await user.save();
  return res.status(200).json({
    success: true,
    message: user ? "Update password" : "Something went wrong",
  });
});
module.exports = {
  register,
  login,
  getCurrentUser,
  refreshAccessToken,
  logout,
  forgotPassword,
  resetPassword
};
