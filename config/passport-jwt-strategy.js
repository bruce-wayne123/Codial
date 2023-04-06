const passport = require('passport');
const jwtStrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;
const User = require('../models/user');
let options = {
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: "codial"
};

passport.use(new jwtStrategy(options, async function (jwtPayLoad, done) {
    let user = await User.findById(jwtPayLoad._id)
        .catch(function (error) {
            console.log('Error in finding user from JWT', error);
            return;
        });
    if (user) {
        return done(null, user);
    }   
    else {
        return done(null, false);
    }
}));

module.exports=passport;