const UserAddress = require("../models/address");
exports.addAddress = async (req, res) => {
    try {
        const {
            payload
        } = req.body;
        // let address = await UserAddress({payload});
        // res.status(201).json({address})
        // return res.status(200).json({payload})
        if (payload.address._id) {
            let address = await UserAddress.findOneAndUpdate({
                user: req.user._id,
                "address._id": payload.address._id
            }, {
                $set: {
                    "address.$": payload.address,
                }
            });
            res.status(201).json({
                address
            });
        } else {
            let address = await UserAddress.findOneAndUpdate({
                user: req.user._id
            }, {
                $push: {
                    address: payload.address
                }
            }, {
                new: true,
                upsert: true
            })
            if(address){

                res.status(201).json({
                    address
                });
            }
        }
 
    } catch (err) {
        res.status(400).json({
            error: "Params address required",
            err
        });
    }
}

exports.getAddress = async (req, res) => {
    try {
        let userAddress = await UserAddress.findOne({
            user: req.user._id
        });
        if (userAddress) {
            res.status(200).json({
                userAddress
            });
        }
    } catch (error) {
        res.status(422).json({
            error
        });
    }
}