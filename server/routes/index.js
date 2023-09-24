const userRouter = require("./user");
const productRouter = require("./product");
const { notFound, errHandler } = require("../middleware/errorHandler");
const productCategoryRouter = require("./productCategory");
const blogCategoryRouter = require("./blogCategory");
const initRoutes = (app) => {
  app.use("/api/user", userRouter);
  app.use("/api/product", productRouter);
  app.use("/api/productcategory", productCategoryRouter);
  app.use("/api/blogcategory", blogCategoryRouter);
  //Pass the error not found
  app.use(notFound);
  //Handler error
  app.use(errHandler);
};

module.exports = initRoutes;
