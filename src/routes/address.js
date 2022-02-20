const express = require ("express");
const { authorize, userMiddleware} = require("../common/commonAuth");
const { addAddress, getAddress } = require("../controller/address");

const router = express.Router();
router.post("/user/address/create",authorize,userMiddleware,addAddress);
router.get("/user/address", authorize,userMiddleware,getAddress);


module.exports = router;