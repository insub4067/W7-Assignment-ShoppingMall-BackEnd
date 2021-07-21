const mongoose = require("mongoose");

const CartSchema = new mongoose.Schema({
    loginid:{
        type: String,
        required: true
    },
    username:{
        type: String,
        required: true
    },
    price :{
        type: Number,
        required: true
    },
    productname :{
        type: String,
        required: true
    },
    thumbnail :{
        type: String,
        required: true
    },
    qunatity:{
        type: Number,
        required: true
    },
    totalprice:{
        type: Number,
        required: true
    },
});

CartSchema.virtual('cartId').get(function () {
    return this._id.toHexString();
});

CartSchema.set('toJSON', {
    virtuals: true,
});

module.exports = mongoose.model("Cart", CartSchema);