// File: /models/round.js

//Require Mongoose
var mongoose = require('mongoose');

//Define a schema
var Schema = mongoose.Schema;

var RoundSchema = new Schema({
    roundNumber: Number,
    videoUrl: String,
    submissions: [{ type: Schema.Types.ObjectId, ref: 'Submission' }],
    winningSubmission: { type: Schema.Types.ObjectId, ref: 'Submission' },
    judge: { type: Schema.Types.ObjectId, ref: 'Player' }
});

module.exports = mongoose.model('Round', RoundSchema);
