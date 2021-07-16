const mongoose = require("mongoose");


const CartSchema = new mongoose.Schema({

    
})






CartSchema.virtual('cartId').get(function () {
    return this._id.toHexString();
});

CartSchema.set('toJSON', {
    virtuals: true,
});

module.exports = mongoose.model("Cart", CartSchema);