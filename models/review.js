const mongoose = require("mongoose");


const ReviewSchema = new mongoose.Schema({

    username: {
        type: String,
        require: true,
    },
    loginid: {
        type: String,
        requie: true,
    },
    content: {
        type: String,
        require: true,
    },
    review_image: {
        type: String,
    },
    productname: {
        type: String,
        require: true,
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