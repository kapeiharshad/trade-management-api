const mongoose = require("mongoose")
const Schema = mongoose.Schema
const CartSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'Users',
        required: true,
    },
    productId: {
        type: Schema.Types.ObjectId,
        ref: "products",
        required: true
    },
    quantity: {
        type: Number,
        default: 1
    }
}, {
    collection: 'carts',
    timestamps: true,
    minimize: false,
})
module.exports = mongoose.model('Cart', CartSchema);