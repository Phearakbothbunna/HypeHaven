var express = require('express');
var router = express.Router();
const User = require('../models/User')
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const multer = require('multer');
const sharp = require('sharp');
// const fs = require('fs');



// Connect to SQLite database
const db = new sqlite3.Database('./database/usersdb.sqlite');
const db3 = new sqlite3.Database('./database/productdb.sqlite');

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
  const fileId = req.query.id;
  db3.get('SELECT * FROM images WHERE id = ?', [fileId], function(err, row) {
    if (err) {
      console.error(err.message);
    } else {
      console.log(row);
      res.render('IndividualProduct', { file: row });
    }
  });
});

// Take the user to the Checkout page
router.get('/Checkout', function(req, res, next){
  const fileId = req.query.id;
  db3.get('SELECT * FROM images WHERE id = ?', [fileId], function(err, row) {
    if (err) {
      console.error(err.message);
    } else {
      console.log(row);
      res.render('Checkout', { file: row });
    }
  });
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

// Handle image upload

// Create a database connection
const db2 = new sqlite3.Database('./database/productdb.sqlite');

// Setup Multer which can help with file upload
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
      fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

// Upload 3 images
router.post('/upload', upload.array('product-pic', 3), async (req, res) => {
  const files = req.files;
  const name = req.body.name;
  const price = req.body.price;
  const description = req.body.description;

  // Loop through each file and Resize and optimize the image using Sharp
  const imageBuffers = [];
  for (const file of files) {
    const { buffer } = file;
    const resizedImage = await sharp(buffer)
      .resize(800)
      .jpeg({ quality: 80 })
      .toBuffer();
      imageBuffers.push(resizedImage);
  }
  // Insert the image data into the database (3 images for all view)
  db2.run(
    'INSERT INTO images (name, data, data2, data3, price, description) VALUES (?, ?, ?, ?, ?, ?)',
    [name, imageBuffers[0], imageBuffers[1], imageBuffers[2], price, description],
    (err) => {
      if (err) {
        console.error(err);
        res.status(500).send('Failed to upload image');
      } else {
        res.redirect('/BusinessUpload');
      }
    }
  );
});

// Retrieve the image, price and description from the database
router.get('/ProductPage', (req, res) => {
  const sql = 'SELECT * FROM images';
  db2.all(sql, [], (err, rows) => {
    if (err) {
      return console.error(err.message);
    }
    // convert blob data to base64 encoded string for each row
    // rows.forEach(row => {
    //   const buffer = Buffer.from(row.data, 'binary');
    //   row.data = `data:image/jpeg;base64,${buffer.toString('base64')}`;
    // });
    res.render('ProductPage', { images: rows });
  });
});

// FOR search functionality
const sql2 = 'SELECT name FROM images';
db2.all(sql2, [], (err, result) => {
  if (err) {
    return console.error(err.message);
  }
  // Extract the names from the result set and store them in a new array
  const names = result.map(row => row.name);

  router.post('/search', (req, res) => {
    const searchQuery = req.body.search; // Get the search query from the form
    // Check if the searchQuery is one of the product names in the names array
    if (names.includes(searchQuery)) {
      // Return the product information
      res.redirect('Individual');
    } else {
      // If the search query does not match the product name, return an error message
      res.send(`<h1>Error</h1>
                <p>Product not found.</p>`);
    }
  });
});

router.post('/placeOrder', (req, res) => {
  const id = req.body.id;
  if (!id) {
    console.log('No ID specified');
    return res.status(400).send('Bad Request: No ID specified');
  }
  // Remove the product from the database
  db2.run(`DELETE FROM images WHERE id = ?`, [id], function(err) {
    if (err) {
      console.log(err.message);
      return res.status(500).send('Internal Server Error');
    }

    console.log(`Product with ID ${id} removed from database`);
    res.send(`Product with ID ${id} removed from database`);
  });
});

module.exports = router;