const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema =  new Schema ({
    firstName: {
        type: String,
        required: true,
        min: 3
    },
    lastName: {
        type: String,
        required: true,
        min: 3
    },
    email: {
        type: String,
        required : true,
        unique: true,
        trim: true,
        min: 6
    },
    password: {
        type: String,
        required : true,
        min: 8
    },
    favorites: {
        type: Array
    },
    admin: false,
    date: {
        type: Date,
        default: Date.now
    }
});

const userModel= mongoose.model('User', userSchema);
module.exports = userModel;