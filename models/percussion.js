// File: /models/percussion.js

//Require Mongoose
var mongoose = require('mongoose');

//Define a schema
var Schema = mongoose.Schema;

var PercussionSchema = new Schema({
    name: String,
    instrument: Number,
    notesequence: [[Number]],
    submissions: [{ type: Schema.Types.ObjectId, ref: 'Submission', default: [] }]
});

module.exports = mongoose.model('Percussion', PercussionSchema);