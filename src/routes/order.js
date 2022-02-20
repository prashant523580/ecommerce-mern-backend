const express = require("express");
const router =express.Router();
const {userMiddleware,authorize} = require('../common/commonAuth');
const { addOrder, getOrders, getOrder } = require("../controller/order");


router.post("/user/addOrder",authorize,userMiddleware,addOrder);
router.get("/user/getOrders", authorize,userMiddleware,getOrders);
router.post("/user/getOrder",authorize, userMiddleware,getOrder);
module.exports = router;