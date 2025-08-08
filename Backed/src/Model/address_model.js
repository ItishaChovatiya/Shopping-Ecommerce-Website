const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
   address_line : {
    type: String,
    default:''
   },
   city : {
    type : String,
    default : ""
  },
  state : {
    type : String,
    default : ""
  },
  pincode : {
    type : String
  },
  country : {
    type : String
  },
  
  landMark : {
    type : String,
    default : ""
  },
  address_Type : {
    type : String,
    enum : ['Home', 'Office']
  },
  user_ID : {
    type : mongoose.Schema.ObjectId,
    default:""
  }
},{
    timestamps: true
});

const AddressModel = mongoose.model('Address', addressSchema);

module.exports = AddressModel;  
