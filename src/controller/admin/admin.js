const User = require("../../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
// const { validateRequest } = require("../../validators/validator");
exports.signin = async (req, res) => {
    
    const {
        email_user,
        password
    } = req.body;
    const verifyUser = await User.findOne({
        username: email_user
    }) || await User.findOne({
        email: email_user
    });
    try {
        // console.log(email_user, password);
        // if (!email_user || !password) {
        //     return res.status(422).json({
        //         error: "fill data"
        //     })
        // }
       
        
        if (!verifyUser) {
           return res.status(422).json({error:"user not found"});
        }else{
            const isMatch = await bcrypt.compare(password, verifyUser.password);
            const token = await verifyUser.generateToken();
            res.cookie("jwt", token, {
                expires: new Date(Date.now() + 1000),
                httpOnly: true,
            });
            if (isMatch || verifyUser.role == "admin") {
                res.status(200).json({
                    message: "admin login success",
                    token,
                    user : verifyUser
                })
            } else {
                res.status(422).json({
                    error: "admin not found or password not match"
                });
            }
        }
         
        
    } catch (error) {
        res.status(422).json({error :"somethings went wrongs",err: error});
    }
}

exports.signup = async (req, res) => {
    try {
        // const errors = validateRequest(req);
        // return response.status(400).json({error: errors.array()})
        const {
            name,
            email,
            username,
            password,
            phone
        } = req.body;
        // if((name  || email  ||  password || username || phone) === ""){
        //     return res.status(422).json({error: "fill input fields"})
        // }
        let existUser = await User.findOne({
            email: email
        }) || await User.findOne({username:username});
        if (existUser) {
            // console.log("true")
            res.status(422).json({
                error: "admin already exist"
            })
        }else{

            const user = await new User({
                name,
                username ,
                email,
                password,
                phone,
                role : "admin"
            })
            if(user){

                const token = await user.generateToken();
                console.log(token)
                res.cookie("jwt", token, {
                    expires: new Date(Date.now()),
                    httpOnly: true,
                    // sameSite:'lax',
                    secure: true,
                    // signed : true
                });
                await user.save();
                res.status(201).json({
                    message: "admin registered successfully",
                    user ,
                    token
                })
            }
        }
        } catch (error) {
            res.status(422).json({error});
            console.log(error)
        }
}

exports.signout = (req,res) => {
        res.clearCookie("token");
        res.clearCookie("jwt");
        res.status(200).json({
            message:"sign out successfully"
        })
}