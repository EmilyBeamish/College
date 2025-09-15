const express = require('express'); // import express module
const mongoose = require('mongoose'); // imports
const Booking = require('../models/booking'); // imports booking model 

const bookingRouter = express.Router(); // creates new router tells our app what to do 

// Route for getting all bookings
bookingRouter.route('/')
.get((req, res, next) => {
    Booking.find() // retrieves all bookings from Mongo
    .then((bookings) => {
        res.render('bookinglist', { title: 'Booking List', bookinglist: bookings }); 
    }) // pass list to page bookinglist
    .catch((err) => next(err)); // if something goes wrong sends problem to error handler
})

.post((req, res, next) => { // handles post request
    res.status(403).send('POST operation not supported on /bookings');
})


// Route for creating a new booking
bookingRouter.route('/create')
.get((req, res, next) => {
    res.render('newbooking', { title: 'Training Session' });
}) // show page to create booking

.post((req, res, next) => {
    Booking.create(req.body) // creates new booking in database
    .then((newBooking) => {
        return Booking.find();
    })
    .then((bookings) => {
        res.render('bookinglist', { bookinglist: bookings, title: 'All Bookings' });
    })
    .catch((err) => next(err));
})

//takes the id of the user you want to update puts details on page
bookingRouter.route('/update')
    .post((req, res, next) => {
        const id = req.body.id // takes booking ID from data
        Booking.findById(id) // retrieves booking by ID
            .then((bookingsfound) => {
                res.render("updatebooking.ejs", { id: id, title: "Update Booking" }); // passes to the update page
            }, (err) => next(err))
            .catch((err) => next(err));
    }, (err) => next(err));

//once you submit the new form with updated data it updates the mongodb renders a updateSuccessful page
bookingRouter.route('/updateComplete')
    .post((req, res, next) => {
        Booking.findByIdAndUpdate(req.body.id, req.body) // updates booking with new data
        .then(Booking.find() // retrieves all bookings after updating
            .then((bookingsfound)  => {
                    res.render("updateSuccess.ejs", { "bookinglist": bookingsfound, title: "Updated" });
                }, (err) => next(err))
                .catch((err) => next(err)));
    })


bookingRouter.route('/delete')
    .post((req, res, next) => {
        Booking.findByIdAndDelete(req.body.id) // delete booking by ID
        .then(reportsfound => {
                res.render("deleteSuccess.ejs", { title: "Success :P" });

            }, (err) => next(err))
            .catch((err) => next(err));
    });

   

bookingRouter.route('/report')
.get((req, res, next) => {
    // Render the form for entering name and date
    res.render('report', { title: 'Generate Training Report' });
})
.post((req, res, next) => {
    const { name, startDate, endDate } = req.body; // takes info from data

    // Validate input
    if (!name || !startDate || !endDate) { // if these arent present errors
        return res.render('report', { 
            title: 'Error', 
            message: 'Name, Start Date, and End Date are required.' 
        });
    }

    
    const start = new Date(startDate); // change strings into Javascript objects
    const end = new Date(endDate);

    // Query the database for bookings matching the name and date range
    Booking.find({
        name: name,
        date: { 
            $gte: start, // Date greater than or equal to the start date
            $lte: end    // Date less than or equal to the end date
        }
    })
    .then((bookings) => {
        if (bookings.length > 0) {
            // Render results if bookings are found
            res.render('reportResult', { 
                title: `Training Sessions for ${name}`, 
                bookings 
            });
        } else {

            res.render('report', { 
                title: 'No Bookings Found',  //render messgae if no bookings found
                message: `No bookings found for ${name} between ${start.toDateString()} and ${end.toDateString()}.`
            });
        }
    })
    .catch((err) => next(err)); // Handle errors
});


module.exports = bookingRouter; // exports the bookingRouter
