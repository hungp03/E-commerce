const userRouter = require("./user");
const productRouter = require('./product')
const { notFound, errHandler } = require("../middleware/errorHandler");

const initRoutes = (app) => {
  app.use("/api/user", userRouter);
  app.use('/api/product', productRouter)
  //Pass the error not found
  app.use(notFound);
  //Handler error
  app.use(errHandler)
};

module.exports = initRoutes;
