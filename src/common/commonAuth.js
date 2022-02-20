const jwt = require("jsonwebtoken");
const  multer = require("multer");
const shortid = require("shortid");
const path = require("path");
let storage = multer.diskStorage({
    destination: function(req,file, cb){
        cb(null,path.join(path.dirname(__dirname), "uploads"));
    },
    filename : function(req,file,cb){
         cb(null, shortid.generate() + "-" + file.originalname)
    }
});
// let source_path = path.dirname (__dirname);
exports.uploads = multer({storage});
exports.authorize =(req,res,next) => {
    if(req.headers.authorization){

        let token = req.headers.authorization;
        let user = jwt.verify(token, process.env.SECRET_KEY);
        req.user = user;
    }else{

        return res.status(400).json({message : "authorization required"})
    }
    next()
}
exports.userMiddleware =  (req,res,next) => {
    // const token = req.cookies.jwt;
        // console.log(token)
        // const verifyToken = jwt.verify(token,process.env.SECRET_KEY);
        // const verifyUser = await User.findOne({_id:verifyToken._id ,"tokens:token": token});
        // console.log(verifyToken)
        if(req.user.role  !== "user"){
            return res.status(400).json({message:"access denied user required."})
        }
        next();
}
exports.adminMiddleware =(req,res,next) => {
   

        // const token = req.cookies.jwt;
        // console.log(token)
        // const verifyToken = jwt.verify(token,process.env.SECRET_KEY);
        // const verifyUser = await User.findOne({_id:verifyToken._id ,"tokens:token": token});
        // console.log(verifyToken)
        if(req.user.role !== "admin"){
            return res.status(400).json({message:"access denied admin required."})
        }
        next();
  
}