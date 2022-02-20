const express = require ("express");
const { authorize, userMiddleware} = require("../common/commonAuth");

const { addItemToCart, getCartItems,deleteCartItems } = require("../controller/cart");
const router = express.Router();

router.post("/user/cart/addtocart",authorize,userMiddleware,addItemToCart);
router.get("/user/getcartitems",authorize,userMiddleware,getCartItems);
router.post("/user/cart/remove", authorize,userMiddleware,deleteCartItems);
module.exports = router;