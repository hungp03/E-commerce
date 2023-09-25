const userRouter = require("./user");
const productRouter = require("./product");
const { notFound, errHandler } = require("../middleware/errorHandler");
const productCategoryRouter = require("./productCategory");
const blogCategoryRouter = require("./blogCategory");
const blogRouter = require("./blog");
const initRoutes = (app) => {
  app.use("/api/user", userRouter);
  app.use("/api/product", productRouter);
  app.use("/api/productcategory", productCategoryRouter);
  app.use("/api/blogcategory", blogCategoryRouter);
  app.use("/api/blog", blogRouter);
  //Pass the error not found
  app.use(notFound);
  //Handler error
  app.use(errHandler);
};

module.exports = initRoutes;
