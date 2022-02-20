const Order = require("../models/order");
const Cart = require("../models/cart");
const Address = require("../models/address");
exports.addOrder =  async(req,res) => {
    try{
        const cart = await Cart.deleteOne({user:req.user._id});
        if(cart){
            req.body.user = req.user._id;
            req.body.orderStatus = [
                {
                    type: "ordered",
                    date: new Date(),
                    isCompleted : true
                },
                {
                    type: "packed",
                    isCompleted: false
                },
                {
                    type: "shipped",
                    isCompleted:false
                },
                {
                    type:"delivered",
                    isCompleted: false
                }
            ]
            const order = await Order(req.body);
            let added_order = await order.save();
            if(added_order){
                res.status(201).json({order: added_order});
            }
            
        }
    }catch(error){
        res.status(400).json(error)
    }
    }
    
    exports.getOrders = async (req,res) => {
        try{
        const order = await Order.find({user:req.user._id})
        .select("_id paymentStatus paymentType items orderStatus addressId")
        .populate("items.productId", "_id name productPicture").exec();
        if(order){
            res.status(200).json({order})
        }
    }catch(err){
        res.status(200).json({error:err})

    }
}


exports.getOrder = async(req,res) => {
    try{
        
        let order = await Order.findOne({_id: req.body.orderID})
        .populate("items.productId", "_id name productPicture").lean();
        if(order){
            let address = await Address.findOne({user: req.user._id});
            order.address = address.address.find((adr) => adr._id.toString() == order.addressId.toString());
            res.status(200).json({order});
            
        }
    }catch(error){
            res.status(400).json({error})
    }
}