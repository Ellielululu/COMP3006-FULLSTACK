/**
 * module dependencies for passport configuration
 */
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

// model
const User = require('./models/user.js');

/**
 * passport configuration
 */
const passportConfig = (app) => {

    // serialize and deserialize user 
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser((id, done) => {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

    
    passport.use('local-signup', new LocalStrategy({
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true
    },

    function(req, email, password, done) {

        if(req.body.email === '' || req.body.password === '' || req.body.username === ''){
            req.flash('signupMessage', 'Missing credentials.');
            return done(err);
        } else {

            User.findOne({ 'email' :  email }, function(err, user) {
                if(err) return done(err);

                if(user){
                    req.flash('signupMessage', 'That email is already taken.');
                    return done(null, false, {'signupMessage':'That email is already taken.'});
                } else {

                    var newUser = new User();
                    newUser.email = email;
                    newUser.password = password;
                    newUser.username = req.body.username;

                    // save the user
                    newUser.save(function(err) {
                        if(err) throw err;
                        return done(null, newUser);
                    });
                }
            });
        }
    }));


    passport.use('local-login', new LocalStrategy({
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true
    },

    function(req, email, password, done) {

        User.findOne({ 'email' :  email }, function(err, user) {
            
            if(err) return done(err);

            if(!user) {
                req.flash('loginMessage', 'User is not found.');
                return done(null, false, {'loginMessage': 'User is not found.'});
            }

            if(!user.validPassword(password)){
                req.flash('loginMessage', 'Incorrect password.');
                return done(null, false, {'loginMessage':'Incorrect password.'});
            }

            return done(null, user);
        });

    }));

    
};

module.exports = passportConfig;