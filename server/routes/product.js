const router = require("express").Router();
const ctrls = require("../controllers/product");
const { verifyAccessToken, isAdmin } = require("../middleware/verifyToken");
const uploader = require('../config/cloudinary.config')

router.post("/", [verifyAccessToken, isAdmin], ctrls.createProduct);
router.get("/", ctrls.getProducts);
router.get("/:pid", ctrls.getProduct);
router.put("/update/:pid", [verifyAccessToken, isAdmin], ctrls.updateProduct);
router.put('/uploadimage/:pid', [verifyAccessToken, isAdmin], uploader.array('images',10),ctrls.uploadImagesProduct)
router.delete("/delete", [verifyAccessToken, isAdmin], ctrls.deleteProduct);
router.put("/ratings", verifyAccessToken, ctrls.ratings);
module.exports = router;
