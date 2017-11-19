// File: /models/melody.js

//Require Mongoose
var mongoose = require('mongoose');

//Define a schema
var Schema = mongoose.Schema;

var MelodySchema = new Schema({
    name: String,
    instrument: Number,
    notesequence: [[Number]],
});

MelodySchema.virtual('toJSON').get(function() {
  return {
    id: this._id.toString(),
    name: this.name,
    instrument: this.instrument,
    notesequence: this.notesequence
  }
});

module.exports = mongoose.model('Melody', MelodySchema);