const router = require("express").Router();
const ctrls = require("../controllers/order");
const { verifyAccessToken, isAdmin } = require("../middleware/verifyToken");

router.post("/", [verifyAccessToken], ctrls.createNewOrder);
router.put("/status/:oid", [verifyAccessToken, isAdmin], ctrls.updateStatus);
router.get('/my-order', verifyAccessToken, ctrls.getUserOrder)
router.get('/admin/order', [verifyAccessToken, isAdmin], ctrls.getOrderByAdmin)
module.exports = router;
