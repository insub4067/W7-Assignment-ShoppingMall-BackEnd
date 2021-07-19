const mongoose = require("mongoose");


const ReviewSchema = new mongoose.Schema({

    username: {
        type: String,
        require: true,
    },
    content: {
        type: String,
        require: true,
    },
    productname: {
        type: String,
        require: true,
    },
    thumbnail:{
        type: String,
        required: true
    },

})


ReviewSchema.virtual('reviewId').get(function () {
    return this._id.toHexString();
});

ReviewSchema.set('toJSON', {
    virtuals: true,
});

module.exports = mongoose.model("Review", ReviewSchema);