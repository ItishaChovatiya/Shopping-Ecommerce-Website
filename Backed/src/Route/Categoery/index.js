const express = require('express');
const Auth = require("../../Middlewares/Auth");
const { CreateCategoery, GetCategoery, GetCategoeryCount, GetSubCategoeryCount, GetSingleCat, DeleteCat, UpdateCat } = require('../../Controller/CategoeryCon');
const upload = require('../../Middlewares/Multer');

const Cat_route = express.Router();

Cat_route.post('/CraeteCategoery',upload.array('images'),CreateCategoery);
Cat_route.get('/Get',GetCategoery)
Cat_route.get('/Get/Count',GetCategoeryCount)
Cat_route.get('/Get/Count/SubCatCount',GetSubCategoeryCount)
Cat_route.get('/GetSingleCat/:id',GetSingleCat)
Cat_route.delete('/deleteCat',DeleteCat)
Cat_route.put('/update/:id',upload.array('images') ,UpdateCat)


module.exports = Cat_route;