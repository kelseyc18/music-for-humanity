// File: /models/bass.js

//Require Mongoose
var mongoose = require('mongoose');

//Define a schema
var Schema = mongoose.Schema;

var BassSchema = new Schema({
    name: String,
    instrument: Number,
    notesequence: Object,
    notelength: Number,
    image: String
});

BassSchema.virtual('toJSON').get(function() {
  return {
    id: this._id.toString(),
    name: this.name,
    instrument: this.instrument,
    notesequence: this.notesequence,
    notelength: this.notelength,
    image: this.image
  }
});

module.exports = mongoose.model('Bass', BassSchema);
