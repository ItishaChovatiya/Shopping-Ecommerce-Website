const express = require('express');
const Auth = require("../../Middlewares/Auth");
const upload = require('../../Middlewares/Multer');
const { AddHomeBanner, GetHomeBanner, DeleteHomeBanner } = require('../../Controller/BannerCon');



const HomeBanner_route = express.Router();

HomeBanner_route.post('/AddHomeBanner', Auth, upload.single('image'),AddHomeBanner); 
HomeBanner_route.get('/getBanners',GetHomeBanner);
HomeBanner_route.delete("/delete",DeleteHomeBanner)

module.exports = HomeBanner_route;