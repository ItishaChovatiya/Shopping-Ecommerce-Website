const express = require("express");
const Auth = require("../../Middlewares/Auth");
const { CreateOrder, GetOrderListForUser, CreatePayPalCon, CaptureOrderPayPal, GetAllOrderList, UpdateOrderStatus, TotalSalesCon, TotalUserCon } = require("../../Controller/OrderCon");

const Order_route = express.Router();

Order_route.post("/OrderPlaced", Auth, CreateOrder);
Order_route.get("/GetOrderList", Auth, GetOrderListForUser);
Order_route.post("/CreateOrder_PayPal",Auth,CreatePayPalCon)
Order_route.post("/CapturePayPalOrder",Auth,CaptureOrderPayPal)
Order_route.get("/OrderList",GetAllOrderList)
Order_route.put("/UpdateStatus",UpdateOrderStatus)
Order_route.get("/TotalSales",TotalSalesCon)
Order_route.get("/TotalUsers",TotalUserCon)

module.exports = Order_route;