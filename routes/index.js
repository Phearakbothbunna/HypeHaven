var express = require('express');
var router = express.Router();
const User = require('../models/User')
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');

// Connect to SQLite database
const db = new sqlite3.Database('./database/usersdb.sqlite');

/* GET the Index page */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


//  Take the user to the Business Upload page
router.get('/BusinessUpload', function(req, res, next){
  res.render('BusinessUpload');
});

// Take the user to the Individual Product Page
router.get('/Individual', function(req, res, next){
  res.render('IndividualProduct');
});

// Take the user to the Checkout page
router.get('/Checkout', function(req, res, next){
  res.render('Checkout');
});

// Take the user to the Cart page
router.get('/Cart', function(req, res, next){
  res.render('Cart');
});


// Define route for sign-up form submission
router.post('/signup', (req, res) => {
  // Retrieve username and password from form data
  const username = req.body.username;
  const password = req.body.password;
  const repeatPassword = req.body.repeatPassword;

  // Insert username and password into 'users' table
  let sql = `INSERT or IGNORE INTO USER (username, password) VALUES (?, ?)`;
  db.run(sql, [username, password], function(err) {
  if (err) {
    console.error(err.message);}
  })
  res.redirect("/");
});

router.post('/login', async function(req, res, next){
  // console.log(req.body.username+"-"+req.body.password);
  const user = await User.findUser(req.body.username, req.body.password); 
  // Check if the user exists
  // We send them to the product page if the user exists
  if (user!== null){
    req.session.user = user;
    res.redirect("/ProductPage");
  }
  // Redirect them back to the root page
  else{
    res.redirect("/?msg=InvalidUsernameOrPassword")
    // res.status(401).send('Invalid password');
  }
})

module.exports = router;