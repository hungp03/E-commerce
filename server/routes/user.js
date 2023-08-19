const router = require("express").Router();
const ctrls = require("../controllers/user");
const { verifyAccessToken } = require("../middleware/verifyToken");

router.post("/register", ctrls.register);
router.post("/login", ctrls.login);
router.get("/current", verifyAccessToken, ctrls.getCurrentUser);
router.post("/refreshToken", ctrls.refreshAccessToken);
router.post("/logout", ctrls.logout);

module.exports = router;
