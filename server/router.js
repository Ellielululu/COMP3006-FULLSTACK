/**
 * module dependencies for routes configuration
 */
const path = require('path');
const express = require('express');
const passport = require('passport');
const routesConfig = (app) => {
    // connect static files
    const publicPath = path.resolve(__dirname, '../client/public');
    app.use(express.static(publicPath));

    // set template engine ejs
    app.set('view engine', 'ejs');
    // app.get('/', (req, res) => res.send('Hello app!'));

    app.get('/signup', (req, res) => {
        res.render(path.resolve(__dirname, '../client/views', 'signup.ejs'), {
            signupMessage: req.flash('signupMessage')
        });
    });

    app.get('/login', (req, res) => {
        res.render(path.resolve(__dirname, '../client/views', 'login.ejs'), {
            loginMessage: req.flash('loginMessage')
        });
    });

    app.put('/signup', function(req,res,next){
        passport.authenticate('local-signup', function(err,user,info){
            if (err) {
                return res.json(200,info)
            }
            if (!user) {
                return res.json(200,info)
            }
            // res.redirect('/');
            return res.json(200,user)
        })(req, res, next);
    });

    app.put('/login', function(req,res,next){

        passport.authenticate('local-login', function(err,user,info){
            if (err) {
                return res.json(200,info)
            }
            if (!user) {
                return res.json(200,info)
            }
            // res.redirect('/');
            return res.json(200,user)
        })(req, res, next);
    });

    app.get('/logout', (req, res) => {
        req.logout();
        res.redirect('/login');
    })
      
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect: '/',
        failureRedirect: '/signup'
    }));

    app.post('/login', passport.authenticate('local-login', { 
        successRedirect: '/', 
        failureRedirect: '/login' 
    }));


    app.get('*', (req, res) => {

        if(req.isAuthenticated()){
            res.render(path.resolve(__dirname, '../client/views', 'index.ejs'));
            // res.sendFile(path.resolve(__dirname, '../client/views', 'index.html'));
        } else {
            res.redirect('/login');
        }
    });
}

module.exports = routesConfig;