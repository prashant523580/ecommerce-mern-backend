const express = require("express");
const { authorize, adminMiddleware ,uploads} = require("../../common/commonAuth");
const { createPage, getPage } = require("../../controller/admin/page");

const router = express.Router();

router.post("/create",authorize,adminMiddleware, uploads.fields([
    {name:"banners"},
    {name:"products"}
]) , createPage);
router.get('/:category/:type', getPage);
module.exports = router;