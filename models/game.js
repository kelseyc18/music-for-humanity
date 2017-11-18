// File: /models/game.js

//Require Mongoose
var mongoose = require('mongoose');

//Define a schema
var Schema = mongoose.Schema;

var GameSchema = new Schema({
    currentRound: {type: Schema.Types.ObjectId, ref: 'Round'},
    rounds: [{ type: Schema.Types.ObjectId, ref: 'Round' }],
});

//Export function to create "Game" model class
module.exports = mongoose.model('Game', GameSchema);