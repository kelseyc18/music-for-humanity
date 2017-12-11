// File: /models/melody.js

//Require Mongoose
var mongoose = require('mongoose');

//Define a schema
var Schema = mongoose.Schema;

var MelodySchema = new Schema({
    name: String,
    instrument: Number,
    notesequence: Object,
    image: String
});

MelodySchema.virtual('toJSON').get(function() {
  return {
    id: this._id.toString(),
    name: this.name,
    instrument: this.instrument,
    notesequence: this.notesequence,
    image: this.image
  }
});

module.exports = mongoose.model('Melody', MelodySchema);
