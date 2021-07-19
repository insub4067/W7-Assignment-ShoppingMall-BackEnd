const mongoose = require("mongoose");


const ReviewSchema = new mongoose.Schema({

    username: {
        type: String,
        required: true,
    },
    loginid: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    star: {
        type: Nuber,
        required: true
    },
    review_image: {
        type: String,
    },
    productname: {
        type: String,
        required: true,
    },
    thumbnail:{
        type: String,
        required: true
    },
    createdAt: {
        type: String,
    },

})


ReviewSchema.virtual('reviewId').get(function () {
    return this._id.toHexString();
});

ReviewSchema.set('toJSON', {
    virtuals: true,
});

module.exports = mongoose.model("Review", ReviewSchema);