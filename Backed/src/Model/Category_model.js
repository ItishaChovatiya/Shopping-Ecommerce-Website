const mongoose = require('mongoose');

const category_schema = mongoose.Schema({
    Name :{
        type: String
    },
    images : [{
        type: String
    }],
    parentCatName : {
        type: String
    },
    parentCatId : {
        type: mongoose.Schema.ObjectId,
        ref: 'Category',
        default : null
        }
},{timestamps : true})

const Categoies = mongoose.model('Category', category_schema);
module.exports = Categoies;