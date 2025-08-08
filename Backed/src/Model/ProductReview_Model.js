const mongoose = require('mongoose');

const productReview_schema = mongoose.Schema({
    image:[{
        type: String,
        trim: true
    }],
    Name: {
        type: String,
        trim: true
    },
    review: {
        type: String,
        trim: true
    },
    rating: {
        type: String,
        trim: true
    },
    userId: {
        type: String,
        trim: true
    },
    productId : {
        type: String,
        trim: true
    },
    date_created: {
        type: Date,
        default: Date.now,
    }
}, { timestamps: true });

const ProductReview = mongoose.model('Review', productReview_schema);
module.exports = ProductReview;