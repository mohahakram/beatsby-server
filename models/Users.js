const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema =  new Schema ({
    userName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required : true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required : true
    },
    admin: false,
    date: {
        type: Date,
        default: Date.now
    },
    beats: [{
        type: Schema.Types.ObjectId,
        ref: 'Beat'
    }],
    favourites: [{
        type: Schema.Types.ObjectId,
        ref: 'Favourite'
    }],
    cart: [{
        type: Schema.Types.ObjectId,
        ref: 'Cart'
    }]
});

const userModel= mongoose.model('User', userSchema);
module.exports = userModel;