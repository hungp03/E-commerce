require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();

const port = process.env.PORT || 8080;
const dbConnect = require("./config/dbconnect");

const initRoutes = require("./routes/index");

app.use(cookieParser());
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    methods: ["POST", "PUT", "GET", "DELETE"],
  })
);
//parse incoming data from request
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

dbConnect();

initRoutes(app);
app.use("/", (req, res) => {
  res.send("Server running!");
});
app.listen(port, () => {
  console.log(`App is running on port ${port}`);
});
