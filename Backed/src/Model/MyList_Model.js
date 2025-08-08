const mongoose = require('mongoose');

const mylistSchema = new mongoose.Schema({
    productName: {
        type: String,
        required: true,
        trim: true
    },
    image: {
        type: String,
        trim: true
    },
    rating: {
        type: String,
        trim: true
    },
    price: {
        type: Number,
        required: true
    },
    oldPrice: {
        type: Number,
    },
    discount: {
        type: Number,
    },
    productId: {
        type: String,
        required: true
    },
    userId: {
        type: String,
        required: true
    },
    brand: {
        type: String,
        trim: true
    }
}, {
    timestamps: true
});

const MyListModel = mongoose.model('MyList', mylistSchema);
module.exports = MyListModel;  