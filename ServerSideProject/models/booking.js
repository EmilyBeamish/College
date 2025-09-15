const mongoose = require('mongoose'); // imports 
const Schema = mongoose.Schema;


var bookingSchema = new Schema({ // new schema using schema constructor
    name: {
        type: String,
        required: true,
        minimum: [1]
        
    },
    numberid: {
        type: Number,
        required: true,
        maximum: [10]
    },
    email: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true,
        validate: {
            validator: function(value) {
                return value >= new Date(); // Ensure the date is today or in the future
            },
            message: 'Date must be today or later'
        }

    },
    time: {
        type: String,
        required: true
    }
}, {
    timestamps: true // add time booking was created at
});
var Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;