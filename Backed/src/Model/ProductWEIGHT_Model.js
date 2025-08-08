const mongoose = require('mongoose');

const productWeightSchema = mongoose.Schema({
    weight: {
        type: String,
        trim: true,
        required: true
    },
    date_created: {
        type: Date,
        default: Date.now,
    }
}, { timestamps: true });

const ProductWeight = mongoose.model('ProductWeight', productWeightSchema);
module.exports = ProductWeight;