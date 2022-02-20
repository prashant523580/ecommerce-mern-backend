const Order = require('../../models/order');
const Address = require("../../models/address")
exports.updateOrder = async(req,res) => {
        try{
            console.log(req.body)
            let updatedOrder = await Order.updateOne({
                _id:req.body.orderId,
                "orderStatus.type": req.body.type,
            },{
                $set:{
                    'orderStatus.$': [
                        {
                            type:req.body.type, date: new Date(), isCompleted: true
                        },
                    ],
                },
            });
            if(updatedOrder){
                res.status(201).json({orders:updatedOrder})
            }
        }catch(error){
            res.status(400).json({error});
        }
}

exports.getCustomerOrders = async(req,res) => {
   try{

       const orders = await Order.find({})
       .populate("items.productId", "name")
    //    .populate("addressId")
            .populate("user")
       .exec();
    //    .lean();
    //    console.log(orders)
       if(orders){
                res.status(200).json({orders});
        }
    }catch(error){
        res.status(400).json({error});
    }
    }