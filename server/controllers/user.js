const User = require("../models/user");
const asyncHandler = require("express-async-handler");

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
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  //kiểm tra trước để giảm tải cho db
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Missing input",
    });
  }
  const response = await User.findOne({ email });
  //console.log(response.isCorrectPassword(password))
  //Waiting pw check => await
  if (response && (await response.isCorrectPassword(password))) {
    //Destructuring pw and role
    //toObject: convert MongoObject to plain Object, to use Destructuring and rest operator
    const { password, role, ...userData } = response.toObject(); 
    return res.status(200).json({
      success: true,
      userData,
    });
  } else {
    throw new Error("Invalid credentials!");
  }
});

module.exports = {
  register,
  login,
};
