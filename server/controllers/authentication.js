const user = require('../collections/users');
const jwt = require('jwt-simple');
const config = require('../config');
function tokenForUser(user) {
    const timestamp = new Date().getTime();
    return jwt.encode({sub:user.id,iat:timestamp},config.secret);
}
exports.signup=function(req,res,next) {
    const email = req.body.email;
    const password = req.body.password;

if(!email || !password) {
    return res.status(422).send("enter email and password both");
}

user.findOne({ email : email },function(err,existingUser) {
    if(err) {
        return next(err);
    }
    if(existingUser){
        return res.status(422).send({ error : "this email is in use" });
    }
    const userr = new user({
        email : email,
        password : password
    });
    userr.save(function(err) {
        if(err) { return next(err); }
        res.json({
            token:tokenForUser(userr)
        });
    });
});
}
exports.signin=function(req,res,next) {
    res.send({ token:tokenForUser(req.user) });
}