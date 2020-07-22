const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const playlistSchema = new Schema({
    type: String
})

const playlistModel = mongoose.model('Playlist', playlistSchema);

module.exports = playlistModel;