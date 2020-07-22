// const passport = require('passport');
// const LocalStrategy = require('passport-local').Strategy;
// const passportJWT = require('passport-jwt');
// const JWTStrategy = require('passport-jwt').Strategy;
// const bcrypt = require('bcrypt');
// const User = require('../models/User');

// passport.use( new LocalStrategy({
//     usernameField: 'email'
// }, async (username, password, done) => {
    
//     userModel.findOne( { email: email } )
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


// passport.use( new JWTStrategy({
//     jwtFromRequest: req => req.cookies.kwt,
//     secretOrKey: process.env.JWT_SECRET,
// }, (jwtPayload, done) => {
//     if( Date.now() > jwtPayload.expires) {
//         return done('jwt expired');
//     }
//     return done(null, jwtPayload);
// }))