//* ACCESS TO VARIABLES IN .ENV FILE
require('dotenv').config();

const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser')
const cors = require('cors');
var logger = require('morgan');
const mongoose = require('mongoose');
const connection = require('./config/dbConnection')
const passport = require('passport');
// const multer = require('multer');
// var upload = require('./config/multer');
// const routes = require('./routes');

//*--------------GENERAL SETUP----------------

const app = express();
app.use(express.urlencoded({
    extended: true
}))
app.use(express.json());
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());
app.use(cookieParser());
app.use(logger('dev'));


// enable requests from different domains
var corsOptions = {
    origin: process.env.FRONTEND_URI,
    allowedHeaders: "Content-Type, Authorization, X-Requested-With",
    credentials: 'include',
    optionSuccessStatus: 200
}

app.use(function(req, res, next) {
    res.set("Access-Control-Allow-Origin", req.header.origin);
    res.set("Access-Control-Allow-Credentials", 'true');
    res.set("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(cors(corsOptions));

//*--------------PASSPORT SETUP---------------------

//initialize or refresh passport middleware for every route
app.use(passport.initialize());

//*---------------MULTER SETUP----------------

// definine as static file
app.use('/uploads', express.static('uploads'))

//*------------------ROUTES-----------------------

app.use('/session', require('./routes/auth'));
app.use('/beats', require('./routes/beats'));
app.use('/playlist', require('./routes/playlist'));

// app.use('/current', passport.authenticate('jwt', {session: false}), (req, res) => {
//     res.send("success you can visit this page")
// })
app.use('/test', require('./routes/test'));
//*------------------SERVER---------------------

app.listen(process.env.PORT, () => {
    console.log(`Server running on port: ${process.env.PORT}`)
}) 

// server.use(
//     cors({
//       origin: [
//         `${process.env.FRONT_URL}`,
//         'http://localhost:3000',
//         'https://mypage.com',
//       ],
//       credentials: true
//     })
//   );