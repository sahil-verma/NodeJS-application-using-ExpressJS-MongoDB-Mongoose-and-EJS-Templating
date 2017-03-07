// seting up the express
let express = require('express');
let router = express.Router();

// link to the item model for CRUD operations in model folder
let Item = require('../models/item');

// checking while the user is logged in
function isLoggedIn(req, res, next) {
   if (req.isAuthenticated()) {
      return next(); // if user is logged in it will call next
   }

   res.redirect('/'); // if not logged in kicked to the home page
}

/* GET item main page */
router.get('/', function(req, res, next) {

   // use mongoose model to query mongodb for all item 
   Item.find(function(err, items) {
      if (err) {
         console.log(err);
         res.end(err);
         return;
      }

      res.render('items/index', {
         items: items,
         title: 'Items List',
          user: req.user
      });
   });
});

// GET add
router.get('/add', isLoggedIn,  function(req, res, next) {
   // show the add form
   res.render('items/add', {
      title: 'Items Details',
       user: req.user
   });
});

// saving the new item added to the list
router.post('/', isLoggedIn, function(req, res, next) {
   // useing monggose to get through new items added
   Item.create({
      title: req.body.title,
      description: req.body.description,
      price: req.body.price
   }, function(err, items) {
          if (err) {
             console.log(err);
             res.render('error');
             return;
          }
         res.redirect('/items');
   });

   console.log("working");
});

// this get method will delete and refresh the index view
router.get('/delete/:_id', isLoggedIn, function(req, res, next) {
   let _id = req.params._id;

   // using monggose to delete an item from the List
   Item.remove({ _id: _id }, function(err) {
      if (err) {
         console.log(err);
         res.render('error');
         return;
      }
      res.redirect('/items');
   });
});


router.get('/:_id', isLoggedIn, function(req, res, next) {
   // taking the id from the url 
   let _id = req.params._id;

   // using monggose to find the item
   Item.findById(_id, function(err, item) {
      if (err) {
         console.log(err);
         res.render('error');
         return;
      }
      res.render('items/edit', {
         item: item,
         title: 'Item Details',
          user: req.user
      });
   });
});

// saving the updated item
router.post('/:_id', isLoggedIn, function(req, res, next) {
  // taking the id from the url
   let _id = req.params._id;

   // populate new item from the list
   let item = new Item({
      _id: _id,
      title: req.body.title,
      description: req.body.description,
      price: req.body.price
   });

   //getting updateed with new item in tems list
   Item.update({ _id: _id }, item,  function(err) {
      if (err) {
         console.log(err);
         res.render('error');
         return;
      }
      res.redirect('/items');
   });
});

// making it public
module.exports = router;
