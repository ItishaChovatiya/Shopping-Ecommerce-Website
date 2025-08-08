const express = require('express');
const Auth = require("../../Middlewares/Auth");
const { CreateProduct, GetAllPro, GetAllProByCatId, GetAllProByCatName, GetAllProBySubCatName, GetAllProBySubCatId,
    GetAllProBythirdCatId, GetAllProByThirdCatName, GetAllProByPrice, GetAllProByRating, GetProCount, GetAllProByIsFeatured,
    DeleteProduct, UpdateProduct, DeleteAllProduct, CreateRAM, GetProduct, DeleteProductRam, UpdateProductRAM,
    GetProductRAM, CreateWeight, DeleteProductWeight, UpdateProductWeight, GetProductWeight,
    CreateSize, GetProductSize, DeleteProductSize, UpdateProductSize, 
    filter,
    SortBy,
    DataSearchCon} = require('../../Controller/ProductsCon');

const upload = require('../../Middlewares/Multer');

const Products_route = express.Router();

Products_route.post('/createProduct', upload.array("pro_img"), CreateProduct);
Products_route.get('/GetAllPro', GetAllPro)
Products_route.put('/UpdateProduct/:id', Auth, upload.array("pro_img"), UpdateProduct)
Products_route.delete('/deleteProduct/:id', DeleteProduct)
Products_route.delete("/DeleteAllProduct", DeleteAllProduct)

Products_route.get('/GetSingleProduct/:id', Auth, GetProduct)
Products_route.get('/GetProByCatId/:id', GetAllProByCatId)
Products_route.get('/GetProByCatName', GetAllProByCatName)
Products_route.get('/GetProBySubCatId/:id', GetAllProBySubCatId)
Products_route.get('/GetProBySubCatName', GetAllProBySubCatName)
Products_route.get('/GetProBythirdCatId/:id', GetAllProBythirdCatId)
Products_route.get('/GetProBythirdCatName', GetAllProByThirdCatName)
Products_route.get('/getCatByPrice', GetAllProByPrice)
Products_route.get('/getCatByRating', GetAllProByRating)
Products_route.get('/GetProCount', GetProCount)
Products_route.get('/GetProByIsFeatued', GetAllProByIsFeatured)

Products_route.post("/CreateRAM", Auth, CreateRAM)
Products_route.get("/GetproductRAM", GetProductRAM)
Products_route.delete("/DeleteProductRAM/:id", Auth, DeleteProductRam)
Products_route.put("/UpdateProductRAM/:id", Auth, UpdateProductRAM)
Products_route.post("/CreateWeight", Auth, CreateWeight)
Products_route.get("/GetproductWeight", GetProductWeight)
Products_route.delete("/DeleteProductWeight/:id", Auth, DeleteProductWeight)
Products_route.put("/UpdateProductWeight/:id", Auth, UpdateProductWeight)
Products_route.post("/CreateSize", Auth, CreateSize)
Products_route.get("/GetproductSize",GetProductSize)
Products_route.delete("/DeleteProductSize/:id", Auth, DeleteProductSize)
Products_route.put("/UpdateProductSize/:id", Auth, UpdateProductSize)

Products_route.post("/filters",filter)
Products_route.post("/SortedBy",SortBy)
Products_route.get("/GetSerachPro",DataSearchCon)

module.exports = Products_route;