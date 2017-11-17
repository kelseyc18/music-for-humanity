// File: /models/melody.js

//Require Mongoose
var mongoose = require('mongoose');

//Define a schema
var Schema = mongoose.Schema;

var MelodySchema = new Schema({
    name: String,
    url: String
});

module.exports = mongoose.model('Melody', MelodySchema);