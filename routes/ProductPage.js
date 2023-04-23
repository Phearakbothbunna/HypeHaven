var express = require('express');
var router = express.Router();
// const User = require('../models/User')
const sqlite3 = require('sqlite3').verbose();
const db2 = new sqlite3.Database('./database/productdb.sqlite');

// Create a middleware
// This is to make sure that the user cannot directly go to the product page without signing in
const sessionChecker = (req, res, next)=>{
  if(req.session.user){
    next();
  }
  else{
      res.redirect("/?msg=raf");
  }
}
router.use(sessionChecker);


/* GET users listing. */
router.get('/', function(req, res, next) {
  // res.send('respond with a resource');
  // console.log(req.session.user)
  res.render('ProductPage', {title: 'ProductPage'});
});


module.exports = router;