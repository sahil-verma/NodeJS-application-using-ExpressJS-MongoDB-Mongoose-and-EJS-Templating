var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

// passport dependencies
let passport = require('passport');
let session = require('express-session');
let localStrategy = require('passport-local').Strategy;

var index = require('./controllers/index');

// referencing the item created in routes
var items = require('./controllers/items');

var app = express();

// use mongoose to connect to mongodb
var mongoose = require('mongoose');
var conn = mongoose.connection;

// link to config file
var globals = require('./config/globals');

conn.open(globals.db);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// configure passport and sessions
app.use(session({
  secret: 'some salt value here',
    resave: true,
    saveUninitialized: false
}));

//initialising passport 
app.use(passport.initialize());
app.use(passport.session());

// link to the new Account model
let Account = require('./models/account');
passport.use(Account.createStrategy());

// facebook authentication
let FacebookStrategy = require('passport-facebook').Strategy;

passport.use(new FacebookStrategy({
        clientID: globals.facebook.clientID,
        clientSecret: globals.facebook.clientSecret,
        callbackURL: globals.facebook.callbackURL,
        profileFields: [
            'id', 'displayName', 'emails'
        ]
    },
    function(accessToken, refreshToken, profile, cb) {
    console.log(profile);
        Account.findOrCreate({ username: profile.emails[0].value }, function (err, user) {
            return cb(err, user);
        });
    }
));

// google authentication
var GoogleStrategy = require( 'passport-google-oauth2' ).Strategy;

passport.use(new GoogleStrategy({
        clientID:     globals.google.clientID,
        clientSecret: globals.google.clientSecret,
        callbackURL: globals.google.callbackURL,
        passReqToCallback   : true
    },
    function(request, accessToken, refreshToken, profile, done) {
        Account.findOrCreate({ username: profile.emails[0].value }, function (err, user) {
            return done(err, user);
        });
    }
));

passport.serializeUser(Account.serializeUser());
passport.deserializeUser(Account.deserializeUser());

// routes will go after passport config so controllers can use passport as it will not work in other way
app.use('/', index);
app.use('/items', items);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error', {
    title: 'COMP2068 - Book Store',
      user: req.user
  });
});

module.exports = app;
