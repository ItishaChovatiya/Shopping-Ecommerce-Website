const mongoose = require('mongoose');

const product_schema = mongoose.Schema({
    pro_Name: {
        type: String,
        trim: true,
        required: true
    },
    pro_desc: {
        type: String,
        trim: true,
        required: true
    },
    pro_img: [{
        type: String,
        trim: true,
    }],
    pro_brand: {
        type: String,
        trim: true,
        default: ""
    },
    pro_price: {
        type: Number,
        trim: true,
        required: true,
        default: 0
    },
    pro_old_price: {
        type: Number,
        trim: true,
        default: 0
    },
    pro_CatName: {
        type: [String],
        trim: true,
        default: ""
    },
    pro_CatId: {
        type: String,
        trim: true,
        default: ""
    },
    pro_SubCatId: {
        type: String,
        trim: true,
        default: ""
    },
    pro_SubCatName: {
        type: String,
        trim: true,
        default: ""
    },
    pro_thirdSubCat: {
        type: String,
        trim: true,
        default: ""
    },
    pro_thirdSubCatId: {
        type: String,
        trim: true,
        default: ""
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    },
    pro_stoke: {
        type: Number,
        default: 0
    },
    pro_rating : {
        type: Number,
        default: 0
    },
    isFeatured : {
        type: Boolean,
        default: false
    },
    pro_discount: {
        type: Number,
        required: true
    },
    pro_RAM :[ {
        type: String,
        trim: true,
        default : null
    }],
    pro_Size : [{
        type:String,
        trim: true,
        default : null
    }],
    pro_Weight : [{
        type: String,
        trim: true,
        default : null
    }],
    pro_sale : {
        type: Number,
        default : 0
    },
    date_created : {
        type : Date,
        default : Date.now,
    }
},{timestamps : true});

const Product = mongoose.model('Product', product_schema);
module.exports = Product;