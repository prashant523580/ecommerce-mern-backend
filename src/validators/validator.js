const {check, validationResult } = require("express-validator")

exports.validateRequest =[
    check("name")
    .isEmpty()
    .withMessage("name is required"),
    check("username")
    .isEmpty()
    .withMessage("namename is required"),
    check("email")
    .isEmail()
    .withMessage("valid email is required"),
    check("password")
    .isLength({min : 6})
    .withMessage("name is required"),

]
exports.validateRequestSignin =[

    check("email")
    .isEmail()
    .withMessage("valid email is required"),
    check("password")
    .isLength({min : 6})
    .withMessage("name is required"),

];
exports.isRequestValidated = (req,res,next) => {
    const errors = validationResult(req);
    if(errors.array().length > 0){
        return res.status(400).json({
            error : errors.array()[0].msg
        })
    }
    next()
}
