const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    
    username: {
        type: String,
        require: true,
    },
    loginid: {
        type: String,
        require: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    }

});


UserSchema.virtual('userId').get(function () {
    return this._id.toHexString();
});
UserSchema.set('toJSON', {
    virtuals: true,
});

module.exports = mongoose.model('User', UserSchema);