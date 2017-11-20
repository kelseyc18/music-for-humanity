// File: /models/percussion.js

//Require Mongoose
var mongoose = require('mongoose');

//Define a schema
var Schema = mongoose.Schema;

var PercussionSchema = new Schema({
    name: String,
    instrument: Number,
    notesequence: Object,
    notelength: Number
});

PercussionSchema.virtual('toJSON').get(function() {
  return {
    id: this._id.toString(),
    name: this.name,
    instrument: this.instrument,
    notesequence: this.notesequence,
    notelength: this.notelength
  }
});

module.exports = mongoose.model('Percussion', PercussionSchema);