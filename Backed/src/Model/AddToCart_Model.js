const mongoose = require("mongoose");

const AddToCartSchema = new mongoose.Schema({
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
    quantity: {
        type: Number,
        default: 1
    },
    subTotal: {
        type: Number
    },
    productId: {
        type: String,
        required: true
    },
    countInStoke: {
        type: String,
        trim: true
    },
    userId: {
        type: String,
        required: true
    },
    brand: {
        type: String,
        trim: true
    },
    size: {
        type: String,
    },
    weight: {
        type: String,
    },
    ram: {
        type: String,
    }
}, { timestamps: true });

const AddToCart = mongoose.model("AddToCart", AddToCartSchema);

module.exports = AddToCart;
