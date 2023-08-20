const router = require("express").Router();
const ctrls = require("../controllers/user");
const { verifyAccessToken } = require("../middleware/verifyToken");

router.post("/register", ctrls.register);
router.post("/login", ctrls.login);
router.get("/current", verifyAccessToken, ctrls.getCurrentUser);
router.post("/refreshToken", ctrls.refreshAccessToken);
router.post("/logout", ctrls.logout);
router.get('/forgotpassword', ctrls.forgotPassword)
router.put('/resetpassword', ctrls.resetPassword)

module.exports = router;

//Post, put : req.body (Tránh lộ thông tin)
//Get, delete: req.query