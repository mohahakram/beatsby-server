const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const favouriteSchema = new Schema({
    userId: {
        type: String,
        required: true
    },
    favouriteList: [{
        type: Schema.Types.ObjectId,
        ref: 'Beat',
        required: true
    }]
});

const favouriteModel = mongoose.model("Favourite", favouriteSchema);
module.exports = favouriteModel;