var express = require('express');
var router = express.Router();

// add passport for reg and login
let passport = require('passport');
let Account = require('../models/account');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {
    title: 'Appliances - Item Store',
      user: req.user
  });
});

/* GET register */
router.get('/register', function(req, res, next) {
  // load the register.ejs view
  res.render('register', {
    title: 'Please Register',
      user: null
  });
});

/* GET login */
router.get('/login', function(req, res, next) {

  let messages = req.session.messages || [];

  // clear messages from session
  req.session.messages = [];

  res.render('login', {
    title: 'Please Login',
    messages: messages,
      user: null
  });
});

/* POST register */
router.post('/register', function(req, res, next) {
  // use the Account model to create a new user account
    Account.register(new Account({ username: req.body.username }), req.body.password, function(err, account) {
      if (err) {
        console.log(err);
        res.render('error', { title: 'Create Account Error'});
      }
      res.redirect('/login');
    });
});

/* POST login */
router.post('/login', passport.authenticate('local', {
  successRedirect: '/items',
  failureRedirect: '/login',
    failureMessage: 'Invalid Login'
}));

/* GET logout */
router.get('/logout', function(req, res, next) {
  req.logout();
res.redirect('/items');
});

/* GET facebook */
router.get('/facebook', passport.authenticate('facebook', { scope: 'email'}));

/* GET /facebook/callback */
router.get('/facebook/callback',
    passport.authenticate('facebook', {
      failureRedirect: '/login',
        scope: 'email'

    }),
    function(req, res) {
        // redirecting to items
        res.redirect('/items');
    });

/* GET /google - show google login prompt */
router.get('/google',
    passport.authenticate('google', { scope:
        [ 'https://www.googleapis.com/auth/plus.login',
            , 'https://www.googleapis.com/auth/plus.profile.emails.read' ] }
    ));

/* GET /google/callback - check login and redirect */
router.get( '/google/callback',
    passport.authenticate( 'google', {
        successRedirect: '/items',
        failureRedirect: '/login'
    }));
    
module.exports = router;
