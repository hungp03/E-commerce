const userRouter = require("./user");
const { notFound, errHandler } = require("../middleware/errorHandler");

const initRoutes = (app) => {
  app.use("/api/user", userRouter);

  //Pass the error not found
  app.use(notFound);
  //Handler error
  app.use(errHandler)
};

module.exports = initRoutes;
