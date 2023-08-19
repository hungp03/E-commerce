const express = require('express')
require('dotenv').config();

const app = express();
const port = process.env.PORT || 8080;
const dbConnect = require('./config/dbconnect');

const initRoutes = require('./routes/index')

//parse incoming data from request
app.use(express.json());
app.use(express.urlencoded({extended: true}));

dbConnect();

initRoutes(app);
app.use('/', (req, res)=>{
    res.send('Server running!')
})
app.listen(port, ()=>{
    console.log(`App is running on port ${port}`);
})