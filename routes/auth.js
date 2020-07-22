const express = require('express');
const router = new express.Router();
const mongoose = require('mongoose');
const passport = require('passport');
const dbConnection = require('../config/dbConnection');
const User = require('../models/User');
const passportConfig = require('../config/passport');
const bcrypt = require('bcrypt');
// const passportLocal = require('passport-local').Strategy;
const config = require('../config/passport');
const jwt = require('jsonwebtoken');
const Joi = require('@hapi/joi');


const schema = Joi.object({
    firstName: Joi.string().min(3).required(),
    lastName: Joi.string().min(3).required(),
    email: Joi.string().min(8).email().required(),
    password: Joi.string().min(8).required()

});
//* register a new user
router.post('/register', async (req,res) => {

    // console.log('body', req.body)
    const { error } = await schema.validate(req.body);
    if ( error ) {
        console.log(error.details[0].message)
        return res.status(400).send(error.details[0].message)
    }
    // hash password before saving it in the database
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    
    //new user object to be saved in database
    
    await User.findOne({ email: req.body.email }).then( user => {
        if (user) {
        return res.status(400).json( {
            status: "error",
            type: "username",
            msg: "email is already exists. Please chose another email"
            } );
        }
    }).catch ( err => res.status(400).send(err));
            
    
    const newUser = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: hashedPassword
    })

    //saving the new user in database
    try {
        const savedUser = await newUser.save()
        console.log(savedUser);
        res.status(200).send(' user created')

    } catch (err) {
        res.status(400).send(err);
    }
})



//* login an existin user
router.post('/login', (req, res, next) => {
    console.log(req.headers);
    User.findOne({ email: req.body.email }).then( user => {
        if (!user) {
            return res.status(400).json({
                status: "error",
                type: "email",
                msg: "That email is not registered"
            });
        }
    
        bcrypt.compare(req.body.password, user.password).then( isMatch => {
            if (isMatch) {
            // if passwords match generate token 
                const payload = {
                    id: user.id,
                    userName: user.firstName,
                };
                // res.status(200).json(payload)
                const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 43200000 });
                // console.log(token);
                
                //set maximum time the cookie will be valid
                let date = new Date(Date.now() + (12 * 60 * 60 * 1000)); //12h or 43200000 milliseconds
                
                //! SET SECURE TO TRUE (HTTPS) IN OBJECT FOR PRODUCTION MODE / HTTP ONLY SHOULD BE TRUE
                const cookie = res.cookie("auth_token", token, { httpOnly: true, secure: false, expires: date, sameSite: 'None'})
                res.status(200).json({id: user.id, user: user.firstName})
                // console.log(cookie);
                
	            res.end()
            } else {
                return res.status(400).json({
                    status: "error",
                    type: "password",
                    msg: "Passwords do no match"
                });
            }
        });
    }, (req, res, next));
});   

module.exports = router;