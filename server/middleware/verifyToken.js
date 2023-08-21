const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");

const verifyAccessToken = asyncHandler(async (req, res, next) => {
  //Bearer token
  //headers: {authorization: Bearer token}
  if (req?.headers?.authorization?.startsWith("Bearer")) {
    const token = req.headers.authorization.split(" ")[1];
    jwt.verify(token, process.env.JWT_SECRET, (err, decode) => {
      //Nếu accesstoken không hợp lệ
      if (err)
        return res.status(401).json({
          success: false,
          message: "Invalid Access Token",
        });
      //console.log(decode);
      req.user = decode;
      next();
    });
  }
  //Nếu access token không được tìm thấy
  else {
    return res.status(401).json({
      success: false,
      message: "Require authentication",
    });
  }
});

const isAdmin = asyncHandler((req, res, next)=>{
  const {role} = req.user;
  if (role !== 'admin') return res.status(401).json({
    success: false,
    message: 'REQUIRE ADMIM ROLE'
  })
  next();
})
module.exports = {
  verifyAccessToken,
  isAdmin
};
