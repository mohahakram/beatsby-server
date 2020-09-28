const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const beatSchema = new Schema({
    userId: {
        type: String,
        ref: "User",
        required: true
    },
    title: {
        type: String,
        required: true
    },
    artist: {
        type: String,
        required: true
    },
    featureArtist: {
        type: String,
    },
    bpm: {
        type: Number,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    contract: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    audioFile: {
        type: Object,
        required: true
    },
    coverImage: {
        type: Object,
        // required: true
    },
    created: {
        type: Date,
        default: Date.now()
    }
});

const beatModel = mongoose.model("Beat", beatSchema);
module.exports = beatModel;

