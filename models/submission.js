// File: /models/submission.js

//Require Mongoose
var mongoose = require('mongoose');

//Define a schema
var Schema = mongoose.Schema;

var SubmissionSchema = new Schema({
    player: { type: Schema.Types.ObjectId, ref: 'Player' },
    melodyLines: [{ type: Schema.Types.ObjectId, ref: 'Melody' }],
    bassLines: [{ type: Schema.Types.ObjectId, ref: 'Bass' }],
    percussionLines: [{ type: Schema.Types.ObjectId, ref: 'Percussion' }],
    selectedMelody: { type: Schema.Types.ObjectId, ref: 'Melody' },
    selectedBass: { type: Schema.Types.ObjectId, ref: 'Bass' },
    selectedPercussion: { type: Schema.Types.ObjectId, ref: 'Percussion' },
});

module.exports = mongoose.model('Submission', SubmissionSchema);