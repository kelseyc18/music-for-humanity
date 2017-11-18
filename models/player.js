// File: /models/player.js

//Require Mongoose
var mongoose = require('mongoose');

//Define a schema
var Schema = mongoose.Schema;

var PlayerSchema = new Schema({
    name: String,
    winCount: Number,
    game: { type: Schema.Types.ObjectId, ref: 'Game' }
});

PlayerSchema
.virtual('url')
.get(function () {
  return '/gameplay/player/' + this._id;
});

module.exports = mongoose.model('Player', PlayerSchema);