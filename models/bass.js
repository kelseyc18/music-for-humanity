// File: /models/bass.js

//Require Mongoose
var mongoose = require('mongoose');

//Define a schema
var Schema = mongoose.Schema;

var BassSchema = new Schema({
    name: String,
    url: String
});

module.exports = mongoose.model('Bass', BassSchema);
