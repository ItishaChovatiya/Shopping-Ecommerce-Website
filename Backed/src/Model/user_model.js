const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    Name: {
        type: String,
        required: [true, 'Provide name'],
        trim: true,
    },
    email: {
        type: String,
        required: [true, 'Provide email'],
        unique: true,
        trim: true,
    },
    password: {
        type: String,
        trim: true,
        unique: true
    },
    avatar: {
        type: [String],
        default: '',
    },
    mobile: {
        type: Number,
        trim: true,
        default: null
    },
    verify_email: {
        type: Boolean,
        default: false
    },
    access_token: {
        type: String,
        default: ''
    },
    refresh_token : {
        type: String,
        default : ""
    },
    last_login_at: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['Active', 'Inactive', 'Suspended'],
        default: 'Active',
    },
    address_detail: [
        {
            type: mongoose.Schema.ObjectId,
            ref: 'Address',
        }
    ],
    shopping_cart: [
        {
            type: mongoose.Schema.ObjectId,
            ref: 'CartProduct',
        }
    ],
    order_History: [
        {
            type: mongoose.Schema.ObjectId,
            ref: 'Order',
        }
    ],
    otp: {
        type: String,
    },
    otp_expires: {
        type: Date,
    },
    role: {
        type: String,
        enum: ['ADMIN', 'USER'],
        default: 'USER',
    },
    signUpWithGoogle : {
        type : Boolean,
        default : false
    }
}, {
    timestamps: true,
});

const UserModel = mongoose.model('User', userSchema);

module.exports = UserModel;  
