const express = require("express");
const { adminMiddleware, authorize } = require("../../common/commonAuth");
const { updateOrder, getCustomerOrders } = require("../../controller/admin/order");

const router = express.Router();


router.post('/order/updateOrder',authorize,adminMiddleware,updateOrder);
router.get('/order/getCustomerOrders', authorize,adminMiddleware,getCustomerOrders);


module.exports = router;