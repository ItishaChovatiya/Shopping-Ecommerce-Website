const mongoose = require('mongoose');

const productSize_schema = mongoose.Schema({
    size: {
        type: String,
        trim: true,
        required: true
    },
    date_created: {
        type: Date,
        default: Date.now,
    }
}, { timestamps: true });

const ProductSize = mongoose.model('ProductSize', productSize_schema);
module.exports = ProductSize;