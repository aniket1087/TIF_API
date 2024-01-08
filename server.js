const express=require('express');
require('dotenv').config()
const cors = require("cors");

const app=express();
app.use(express.json())

app.use(cors());

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true}));

var cookieParser = require('cookie-parser');
app.use(cookieParser());

//connect to database
const connectDatabase=require('./db/DatabaseConnection');
connectDatabase();

app.use(require('./routes/route'));

app.listen(process.env.PORT, () => {
    console.log(
      `Server is running on http://localhost:${process.env.PORT}`
    );
});