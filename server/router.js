const Authentication = require('./controllers/authentication');
const passportService = require('./services/passport');
const passport = require('passport');

//create a middleware for passport
const requireAuth = passport.authenticate('jwt',{ session : false });
//here we are using a token based strategy

module.exports= function(app) {
    app.get('/',requireAuth,function(req,res) {
        res.send({"hi":"there"});
    });
    app.post('/signup',Authentication.signup);
}