const express = require('express');
const Auth = require("../../Middlewares/Auth");
const { AddAddressCon, GetAddressCon, DeleteAddressCon, UpdateAddressCon, SingleAddressCon } = require('../../Controller/AddressCon');


const Address_route = express.Router();

Address_route.post("/AddAddressData/:id",Auth,AddAddressCon)
Address_route.get("/GetAddressDetail/:id",Auth,GetAddressCon)
Address_route.put("/UpdateAddress/:id",Auth,UpdateAddressCon)
Address_route.get("/singleAddress/:id",Auth,SingleAddressCon)
Address_route.delete("/:id",DeleteAddressCon)

module.exports = Address_route;