const passport = require('passport');
const User = require('../collections/users');
const config = require('../config');
const jwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const LocalStrategy = require('passport-local');
//Strategy is a method to authenticate users
//setup options for jwt Strategy
const jwtOptions = {
    jwtFromRequest : ExtractJwt.fromHeader('authorization'),
    secretOrKey : config.secret
};
const LocalOptions = { 'usernameField' : 'email' };
//create jwt Strategy

const localLogin = new LocalStrategy(LocalOptions,function(email,password,done) {
    User.findOne({ email : email},function(err,user) {
        if(err) { return done(err);}
        if(!user) { return done(null,false); }
        user.comparePassword(password,function(err,isMatch) {
            if(err) { return done(err); }
            if(!isMatch) { return done(null,false); }
            return done(null,user);
    });
    });
});

const jwtLogin=new jwtStrategy(jwtOptions,function(payload,done) {
    //payload is decoded jwtToken
    //done is the call back function
    
    User.findById(payload.sub,function(err,user) {
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
passport.use(localLogin);
