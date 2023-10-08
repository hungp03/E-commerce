const router = require("express").Router();
const ctrls = require("../controllers/user");
const { verifyAccessToken, isAdmin } = require("../middleware/verifyToken");

router.post("/register", ctrls.register);
router.post("/login", ctrls.login);
router.get("/current", verifyAccessToken, ctrls.getCurrentUser);
router.post("/refreshToken", ctrls.refreshAccessToken);
router.post("/logout", ctrls.logout);
router.get("/forgotpassword", ctrls.forgotPassword);
router.put("/resetpassword", ctrls.resetPassword);
router.get("/", [verifyAccessToken, isAdmin], ctrls.getUsers);
router.delete("/delete", [verifyAccessToken, isAdmin], ctrls.deleteUser);
router.put("/updateCurrent", [verifyAccessToken], ctrls.updateUser);
router.put(
  "/adminUpdate/:uid",
  [verifyAccessToken, isAdmin],
  ctrls.updateUserByAdmin
);
router.put('/address', [verifyAccessToken], ctrls.updateUserAddress)
module.exports = router;

//Post, put : req.body (Tránh lộ thông tin)
//Get, delete: req.query
