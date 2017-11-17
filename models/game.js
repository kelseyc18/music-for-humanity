// File: /models/game.js

//Require Mongoose
var mongoose = require('mongoose');

//Define a schema
var Schema = mongoose.Schema;

var GameSchema = new Schema({
    rounds: [{ type: Schema.Types.ObjectId, ref: 'Round' }],
    players: [{ type: Schema.Types.ObjectId, ref: 'Player' }]
});

//Export function to create "Game" model class
module.exports = mongoose.model('Game', GameSchema);