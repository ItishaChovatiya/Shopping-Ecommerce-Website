const express = require("express");
const Products_route = require("./Products");
const user_router = require("./User");
const Cat_route = require("./Categoery");
const MyList_route = require("./MyList");
const Address_route = require("./Address");
const HomeBanner_route = require("./HomeBanner");
const Blog_route = require("./Blog")
const Cart_route = require("./AddToCart");
const Order_route = require("./Order");

const router = express();

router.use("/user", user_router);
router.use("/HomeBanner", HomeBanner_route);
router.use("/Blog", Blog_route);
router.use("/product", Products_route);
router.use("/Category", Cat_route);
router.use("/Cart", Cart_route);
router.use("/MyList", MyList_route);
router.use("/address", Address_route);
router.use("/Order", Order_route);

module.exports = router;
