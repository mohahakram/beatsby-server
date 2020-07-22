const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const beatSchema = new Schema({
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
        type: String,
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
        type: String,
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

