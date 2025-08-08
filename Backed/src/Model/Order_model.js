const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
    products: [
      {
        productId: {
          type: String,
        },
         productTitle: {
          type: String,
        },
        quantity : {
          type: Number,
        },
        price : {
            type : Number
        },
        image : {
            type : String
        },
        subTotal : {
            type : Number
        },
        pro_stoke : {
        type : Number
    },
      },
    ],
    
    paymentId: {
      type: String,
      default: "",
    },
    payment_status: {
      type: String,
      default: "",
    },
    order_status : {
        type : String,
        default :"pending" 
    },
    delivery_address: {
      type: mongoose.Schema.ObjectId,
      ref: "Address",
     required: [true, "Delivery address is required"]
    },
    totalAmount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const OrderModel = mongoose.model("Order", orderSchema);
module.exports = OrderModel;
