const passport = require('passport');
const user = require('../collections/users');
const config = require('../config');
const jwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
//Strategy is a method to authenticate users
//setup options for jwt Strategy
const jwtOptions = {
    jwtFromRequest : ExtractJwt.fromHeader('authorization'),
    secretOrKey : config.secret
};
//create jwt Strategy
const jwtLogin=new jwtStrategy(jwtOptions,function(payload,done) {
    //payload is decoded jwtToken
    //done is the call back function
    user.findById(payload.sub,function(err,user) {
        if(err) { return done(err,false); }
        if(user) {
            done(null,user);
        }
        else {
            done(null,false);
        }
    });
});
passport.use(jwtLogin);
