require('dotenv').config();
const mongoose = require("mongoose");
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const User = require('../models/User')

// passport.use( new LocalStrategy({
//     usernameField: 'email'
// }, async (email, password, done) => {
    
//     User.findOne( { email: email } )
//         .then( user => {
//             if (err) {
//                 return done(err, null);
//             }
//             if (!user) {
//                 return done(null, false, "Incorrect infos" ) //no error, user not found, message
//             }
//             if (!bcrypt.compare(password, user.password) ) {
//                 return done(null, false, "Incorrect password")
//             } else {
//                 return done(null, user)//no error, return user
//             }
//         })
//         .catch( (err) => {
//             done(err);
//         })
// }));

// const verifyCallback = (email, password, done) => {

//     userModel.findOne( { email: email } )
//         .then( user => {
//             if (err){
//                 return done(err, null);
//             }
//             if ( !user ) {
//                 return done(null, false, "Incorrect infos" ) //no error, user not found, message
//             }
//             if ( !bcrypt.compare(password, user.password) ){
//                 return done(null, false, "Incorrect password")
//             } else {
//                 return done(null, user)//no error, return user
//             }
//         })
//         .catch( (err) => {
//             done(err);
//         })
// }

// const localStrategy = new LocalStrategy( { usernameField: "email"}, verifyCallback)

// passport.use(localStrategy);


const opts = {};

opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.JWT_SECRET;



module.exports = passport => {
  passport.use(
    new JwtStrategy(opts, (jwt_payload, done) => {
      User.findById(jwt_payload.id)
        .then(user => {
          if (user) {
            return done(null, user);
          }
          return done(null, false);
        })
        .catch( err => done(console.error(err)));
    })
  );
};