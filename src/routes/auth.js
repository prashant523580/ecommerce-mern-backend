const bcrypt = require("bcryptjs/dist/bcrypt");
const express = require("express");
const { check } = require("express-validator");
const { signin, signup, requireSignin } = require("../controller/user");
const auth = require("../middleware/auth");
const router = express.Router();
const User = require("../models/user");
const {validateRequest, isRequestValidated} = require("../validators/validator");
router.post("/signin",isRequestValidated,signin);
router.post("/signup", signup);
router.post("/profile",requireSignin,(req,res)=> {
    res.status(200).json({user : "profile"})
})
// router.post("/profile",requireSignin);
module.exports = router;