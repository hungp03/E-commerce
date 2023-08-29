const router = require("express").Router();
const ctrls = require("../controllers/product");
const { verifyAccessToken, isAdmin } = require("../middleware/verifyToken");

router.post("/", [verifyAccessToken, isAdmin], ctrls.createProduct);
router.get("/", ctrls.getProducts);
router.get("/:pid", ctrls.getProduct);
router.put("/update/:pid", [verifyAccessToken, isAdmin], ctrls.updateProduct);
router.delete("/delete", [verifyAccessToken, isAdmin], ctrls.deleteProduct);
module.exports = router;
