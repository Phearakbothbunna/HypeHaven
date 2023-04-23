var express = require('express');
var router = express.Router();
const sqlite3 = require('sqlite3').verbose();


// Set up a route to handle image uploads

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

router.get('/', function(req, res, next){
    res.render('BusinessUpload');
});



module.exports = router;