// File: /models/percussion.js

//Require Mongoose
var mongoose = require('mongoose');

//Define a schema
var Schema = mongoose.Schema;

var PercussionSchema = new Schema({
    name: String,
    url: String
});

module.exports = mongoose.model('Percussion', PercussionSchema);