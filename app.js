//* ACCESS TO VARIABLES IN .ENV FILE
require('dotenv').config();

const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser')
const cors = require('cors');
var logger = require('morgan');
const mongoose = require('mongoose');
const connection = require('./config/dbConnection');
const passport = require('passport');
const passportConfig = require("./config/passport")(passport);

//*------------initialize stripe--------------

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

//*--------------GENERAL SETUP----------------

//initialize app
const app = express();
app.use(express.urlencoded({
    extended: true
}))
app.use(express.json());
app.use(cookieParser());
//nodemon log
app.use(logger('dev'));

// enable requests from different domains
var corsOptions = {
    origin: process.env.FRONTEND_URI,
    allowedHeaders: "Content-Type, Authorization, X-Requested-With",
    credentials: 'include',
    optionSuccessStatus: 200
}

// cors settings to enable cross origin requests
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

// define as static file
app.use('/uploads', express.static('uploads'))

//*------------------ROUTES-----------------------

// redirect request to specific route
app.use('/session', require('./routes/auth'));
app.use('/beat', require('./routes/beat'));
app.use('/play', require('./routes/play'));
app.use('/playlist', require('./routes/playlist'));
app.use('/favourite', passport.authenticate('jwt', {session: false}), require('./routes/favourite'));
app.use('/dashboard', passport.authenticate('jwt', {session: false}), require('./routes/dashboard'));
app.use('/cart', passport.authenticate('jwt', {session: false}), require('./routes/cart'));
app.use('/checkout', passport.authenticate('jwt', {session: false}), require('./routes/checkout'));

//*------------------SERVER---------------------

app.listen(process.env.PORT, () => {
    console.log(`Server running on port: ${process.env.PORT}`)
}) 
