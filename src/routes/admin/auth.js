const bcrypt = require("bcryptjs/dist/bcrypt");
const express = require("express");
const { check } = require("express-validator");
const { authorize } = require("../../common/commonAuth");
const { signin, signup,signout} = require("../../controller/admin/admin");
const { requireSignin } = require("../../controller/user");
const router = express.Router();
const User = require("../../models/user");
router.post("/signin", signin);
router.post("/signup", signup);
router.post("/signout", signout);

module.exports = router;