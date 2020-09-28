const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const cartSchema = new Schema({
    userId: {
        type: String,
        required: true
    },
    cartList: [{
        type: Schema.Types.ObjectId,
        ref: "Beat",
        required: true
    }]
});

const cartModel = mongoose.model("Cart", cartSchema);
module.exports = cartModel;