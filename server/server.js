/**
 * modules dependencies for server
 */
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const flash = require('req-flash');
const mongoose = require('mongoose');
const passport = require('passport');

// server config
const serverConfig = require('./config.js');

// connect to database
mongoose.connect(serverConfig.DBURL, { useNewUrlParser: true });
if(serverConfig.LAUNCH === 'dev') mongoose.set('debug', true);

// initialize express
const app = express();
const server = require('http').createServer(app);

// read cookies
app.use(cookieParser());

// get data from html froms
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// log server requests
if(serverConfig.LAUNCH === 'dev') app.use(logger('dev'));

// required for passport
var sessionMiddleware = session({
    name: "lululu",
    secret: "lululu",  // session secret
    store: new (require("connect-mongo")(session))({
        url: serverConfig.DBURL
    })
});
app.use(sessionMiddleware);

// connect flash for flash messages
app.use(flash());

// initialize passport
app.use(passport.initialize());
app.use(passport.session());

// apply passport configs
require('./passport.js')(app);

// apply route
require('./router.js')(app);

// socket.io instantiation
const io = require('socket.io')(server)
    .use(function(socket, next){
        // wrap the express middleware
        sessionMiddleware(socket.request, {}, next);
    });
require('./socket.js')(io);

// please enter"localhost:3000/login" to enter
server.listen(serverConfig.PORT, (error) => {
    if(error) throw error;
    console.log(`Listening on port ${serverConfig.PORT}`);
});

