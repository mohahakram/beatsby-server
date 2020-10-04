require("dotenv").config();
const express = require('express');
const router = new express.Router();
const mongoose = require('mongoose');
const passport = require('passport');
const dbConnection = require('../config/dbConnection');
const User = require('../models/Users');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Joi = require('@hapi/joi');

// Joi check for invalid informations sent from client 
const schema = Joi.object({
    userName: Joi.string().min(3).required(),
    email: Joi.string().email().min(8).required(),
    password: Joi.string().min(8).required()

});

//* register a new user
router.post('/register', async (req,res) => {
    //return error if raised from Joi
    const { error } = await schema.validate(req.body);
    if ( error ) {
        console.log(error.details[0].message)
        return res.status(400).json({status: "error", msg: error.details[0].message})
    }
    // hash password before saving it in the database
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    
    //check if user/email already exists
    await User.findOne({ email: req.body.email }).then( user => {
        if (user) {
        return res.status(400).json({
            status: "error",
            type: "username",
            msg: "e-mail already exists. Please chose another e-mail"
            });
        }
    }).catch ( err => res.status(400).send(err));
            
    //if not create new user object to be saved in database
    const newUser = new User({
        userName: req.body.userName,
        email: req.body.email,
        password: hashedPassword
    })

    //saving the new user in database
    try {
        const savedUser = await newUser.save()
        console.log(savedUser);
        res.status(200).send(' user created')

    } catch (err) {
        res.status(500).send(err);
    }
})


//* log in an existin user
router.post('/login', (req, res, next) => {
    // check if user exists with email
    User.findOne({ email: req.body.email }).then( user => {
        if (!user) {
            return res.status(400).json({
                status: "error",
                type: "email",
                msg: "wrong e-mail or password"
            });
        }
        //if user exists compare user password to db password
        bcrypt.compare(req.body.password, user.password).then( isMatch => {
            if (isMatch) {
            // if passwords match generate token 
                const payload = {
                    id: user.id,
                    userName: user.userName,
                };
                const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 43200000 });
                
                //set maximum time the cookie will be valid
                let date = new Date(Date.now() + (12 * 60 * 60 * 1000)); //12h or 43200000 milliseconds
                
                //check for environment to set cookie to secure
                secureCookie = process.env.NODE_ENV === "production" ? true : false;

                //! SET SECURE TO TRUE (HTTPS) IN OBJECT FOR PRODUCTION MODE / HTTP ONLY SHOULD BE TRUE
                //send back token in expiring cookie
                // const cookie = res.cookie("auth_token", token, { httpOnly: true, secure: secureCookie, expires: date, sameSite: 'None'})
                res.status(200).json({id: user.id, userName: user.userName, jwt: token})
                // res.end()
            } else {
                //if passwords dont match send back error message
                return res.status(400).json({
                    status: "error",
                    type: "password",
                    msg: "wrong e-mail or password"
                });
            }
        });
    }, (req, res, next));
});   

module.exports = router;