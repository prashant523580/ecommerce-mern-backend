const mongoose = require('mongoose');
const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    addressId: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "UserAddress",
        required: true,
        //  autopopulate: true
    },
    items: [{
        productId: {

            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        payablePrice: {
            type: Number,
            // required:true
        },
        purchasedQuantity: {
            type: Number
        }
    }],
    paymentStatus: {
        type: String,
        enum: ["cancelled", "pending", "refund", "completed"]
    },
    paymentType: {
        type: String,
        emum: ["cod", "card", "esewa"],
        // required: true 
    },
    orderStatus: [
        {
            type: {
                type: String,
                enum: ["ordered", "packed", "shipped", "delivered"]
            },
            date: {
                type: Date
            },
            isCompleted: {
                type: Boolean,
                default: false
            }
        }
    ]
}, { timestamps: true });

module.exports = mongoose.model("Order", orderSchema);