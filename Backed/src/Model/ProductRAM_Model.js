const mongoose = require('mongoose');

const productRAM_schema = mongoose.Schema({
    ram: {
        type: String,
        trim: true,
        required: true
    },
    date_created : {
        type : Date,
        default : Date.now,
    }
},{timestamps : true});

const ProductRAM = mongoose.model('ProductRAM', productRAM_schema);
module.exports = ProductRAM;