var express = require('express');
const bookingRouter = require('./bookingRouter');
var router = express.Router();
const Booking = require('../models/booking');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Training Session' });
});

router.get('/bookinglist', function(req, res) {
  phones.find().then((phonesfound) => {
      res.render('bookinglist', { 'bookinglist': bookingsfound, title: 'Bookings' });
  })
});

// About Us page
router.get('/aboutus', (req, res) => {
    res.render('aboutus', { title: 'About Us' });
});

// Contact Us page
router.get('/contact', (req, res) => {
    res.render('contact', { title: 'Contact Us' });
});


module.exports = router;
