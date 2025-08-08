const express = require('express');
const Auth = require("../../Middlewares/Auth");
const { AddToMyList,GetMyList, DeleteProductFromMyList } = require('../../Controller/MyListCon');

const MyList_route = express.Router();

MyList_route.post('/AddToMyList', Auth, AddToMyList);
MyList_route.get("/GetMyList",Auth,GetMyList);
MyList_route.delete("/DeleteFromMyList/:id",Auth,DeleteProductFromMyList)

module.exports = MyList_route;