const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {OAuth2Client} = require("google-auth-library");
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_AUTH_ID);
// const {
//     validationResult
// } = require("express-validator");
exports.signin = async (req, res) => {
    // try {
        
        // console.log(verifyUser)
        const {
            email_user,
            password
        } = req.body;
        if (!email_user || !password) {
            return res.status(422).json({
                error: "fill data"
            })
        }
        const verifyUser = await User.findOne({
            username: email_user
        }) || await User.findOne({
            email: email_user
        });
        if (!verifyUser) {
            res.status(400).json({
                error: "somethings went wrongs"
            })
            
        } else {
            // console.log(verifyUser.password)
            const isMatch = await bcrypt.compare(password, verifyUser.password);
            const token = await verifyUser.generateToken();
            if (isMatch && verifyUser.role == "user") {
                // console.log(isMatch,verifyUser.role)
                // res.cookie("jwt", token, {
                //     expires: "120000000",
                //     secure: true,
                //     httpOnly:true
                // })
               return res.status(200).json({
                    message: "user login success",
                    token,
                    user: verifyUser
                })
            } else {
                res.status(400).json({
                    error: "admin login error"
                });
            }
        }
    // } catch (error) {
        // res.status(400).json({
        //     error : "some thing went worng"
        // })
    // }
}

exports.signup = async (req, res) => {
    const {
        name,
        username,
        email,
        password,
        phone
    } = req.body;
    // if(!name || !username|| !email || !password){
    //     res.status(422).json({
    //         error : "invalid inputs"
    //     })
    // }
    try {

        let existUser = await User.findOne({
            email: email
        }) || await User.findOne({
            username: username
        });
        if (existUser) {
            res.status(422).json({
                error: "user already exist"
            })
        } else {

            const user = await new User({
                name,
                username,
                email,
                phone,
                password,
                role: "user"
            });
            const token  = await user.generateToken();
            await user.save();
            res.status(201).json({
                message: "user registered successfully",
                user,token
            })
        }
    } catch (error) {
        res.status(422).json({
            error
        });
    }
}
exports.requireSignin = (req, res, next) => {
    const token = req.headers.authorization;
    const user = jwt.verify(token, process.env.SECRET_KEY);

    req.user = user;
    next();
}

exports.googleLogin = async (req,res) => {
    const {tokenId} = req.body;
     let ticket = await client.verifyIdToken(
         {
             idToken : tokenId,
              audience:process.env.GOOGLE_CLIENT_AUTH_ID
         }
            )
    
    const {name ,email,picture,email_verified} = ticket.getPayload();
    if(email_verified){
        let existUser = await User.findOne({email});
        if(existUser){
            const token = await existUser.generateToken();
            const {_id,name,email,role} = existUser;
            res.status(200).json({
                user: existUser,token
            })
            console.log(token);
        }else{
            let password = email+process.env.SECRET_KEY
            const googleUser = await new User({
                name ,email ,password ,role:"user"
            });
            const token = await googleUser.generateToken();
            await googleUser.save();
                res.status(201).json({
                    user : googleUser,
                    token
                });

        }
        // console.log(existUser)
    }
   
}
