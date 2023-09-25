const router = require("express").Router();
const ctrls = require("../controllers/blog");
const { verifyAccessToken, isAdmin } = require("../middleware/verifyToken");

router.post("/", [verifyAccessToken, isAdmin], ctrls.createBlog);
router.get("/", ctrls.getBlogs);
router.put("/like/:bid", [verifyAccessToken], ctrls.likeBlog);
router.put("/dislike/:bid", [verifyAccessToken], ctrls.dislikeBlog);
router.put("/update/:bid", [verifyAccessToken, isAdmin], ctrls.updateBlog);
// router.delete("/:bcid", [verifyAccessToken, isAdmin], ctrls.deleteCategory);

module.exports = router;
