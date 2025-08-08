require('dotenv').config();
const mongoose = require('mongoose');

const ConnectDB = async () => {
    try {
        await mongoose.connect(process.env.DBURL);
        console.log("Database connected successfully");
    } catch (err) {
        console.log("Database connection error:", err);
    }
};

module.exports = ConnectDB;