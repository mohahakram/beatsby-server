require('dotenv').config();
const mongoose = require("mongoose");
const passport = require('passport');
const { ExtractJwt } = require('passport-jwt');
const JwtStrategy = require("passport-jwt").Strategy;
const User = require('../models/Users');

// extract cookie from cookie in request header
// const cookieExtractor = req => {
//   console.log(req.headers);
//   let token = null;
//   if (req && req.cookies) {
//     token = req.cookies['auth_token'];
//   }
//   return token;
// };

// options to pass into strategy //cookie from cookies
// const options = {
//   jwtFromRequest: cookieExtractor,
//   secretOrKey: process.env.JWT_SECRET,
//   algorithms: ['HS256']

// };

// options to pass into strategy, cookie from header
const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
  algorithms: ['HS256']

};

// deconstruct cookie then search db with id then return matching user
const strategy = new JwtStrategy(options, (payload, done) => {
  User.findById(payload.id)
        .then(user => {
          if (user) {
            return done(null, user);
          }
          return done(null, false);
        })
        .catch( err => done(console.error(err)));
});

module.exports = (passport) => {
  passport.use(strategy);
}
