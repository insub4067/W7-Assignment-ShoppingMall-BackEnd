const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({

    productname: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    thumbnail:{
        type: String,
        required: true
    },
    detail_images:{
        type: Array,
        required: true,
    },
    createdAt: {
        type: String,
    },
})

ProductSchema.virtual('productId').get(function () {
    return this._id.toHexString();
});

ProductSchema.set('toJSON', {
    virtuals: true,
});

module.exports = mongoose.model("Product", ProductSchema);