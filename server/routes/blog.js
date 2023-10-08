const router = require("express").Router();
const ctrls = require("../controllers/blog");
const { verifyAccessToken, isAdmin } = require("../middleware/verifyToken");
const uploader = require('../config/cloudinary.config')

router.post("/", [verifyAccessToken, isAdmin], ctrls.createBlog);
router.get("/", ctrls.getBlogs);
router.get('/b/:bid', ctrls.getBlog)
router.put('/uploadimage/:bid', [verifyAccessToken, isAdmin], uploader.single('image'),ctrls.uploadImagesBlog)
router.put("/like/:bid", [verifyAccessToken], ctrls.likeBlog);
router.put("/dislike/:bid", [verifyAccessToken], ctrls.dislikeBlog);
router.put("/:bid", [verifyAccessToken, isAdmin], ctrls.updateBlog);
router.delete("/:bid", [verifyAccessToken, isAdmin], ctrls.deleteBlog);

module.exports = router;
