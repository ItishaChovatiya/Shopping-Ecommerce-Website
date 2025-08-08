const express = require('express');
const Auth = require("../../Middlewares/Auth");
const { AddToCartProduct, GetCartProduct,IncreaseCartQty,DeleteCartQty,DecreaseCartQty, EmptyCartCon } = require('../../Controller/AddToCartCon');


const Cart_route = express.Router();

Cart_route.post("/AddToCart",Auth,AddToCartProduct)
Cart_route.get('/GetCartProduct',Auth,GetCartProduct)
Cart_route.post('/IncreaseCartQty',IncreaseCartQty)
Cart_route.post('/deleteCartQty',DeleteCartQty)
Cart_route.post('/decreaseCartQty',DecreaseCartQty);
Cart_route.delete('/EmptyCartPro',Auth,EmptyCartCon)

module.exports = Cart_route;