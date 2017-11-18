// File: /models/game.js

//Require Mongoose
var mongoose = require('mongoose');

//Define a schema
var Schema = mongoose.Schema;

var GameSchema = new Schema({
    name: String,
    currentRound: {type: Schema.Types.ObjectId, ref: 'Round'},
    rounds: [{ type: Schema.Types.ObjectId, ref: 'Round' }],
});

GameSchema.virtual('url').get(function() {
  return '/gameplay/game/' + this._id
});

//Export function to create "Game" model class
module.exports = mongoose.model('Game', GameSchema);