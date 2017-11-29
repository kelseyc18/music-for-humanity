var mongoose = require('mongoose');
var Submission = require('../models/submission');

// Display list of all Submissions
exports.submission_list = function(req, res) {
  res.send('NOT IMPLEMENTED: Submission list');
}

// Display detail page for a specific Submission
exports.submission_detail = function(req, res) {
  res.send('NOT IMPLEMENTED: Submission detail: ' + req.params.id);
}

// Handle Submission create on POST
exports.submission_create_on_post = function(req, res) {
  res.send('NOT IMPLEMENTED: Submission create POST');
}

// Handle Submission update on POST
exports.submission_update_on_post = function(req, res, next) {
  var submissionId = mongoose.Types.ObjectId(req.body.submissionId);
  var selectedMelodyId = req.body.selectedMelodyId ? mongoose.Types.ObjectId(req.body.selectedMelodyId) : null;
  var selectedBassId = req.body.selectedBassId ? mongoose.Types.ObjectId(req.body.selectedBassId) : null;
  var selectedPercussionId = req.body.selectedPercussionId ? mongoose.Types.ObjectId(req.body.selectedPercussionId) : null;
  var playerId = req.body.playerId;

  Submission.findByIdAndUpdate(submissionId,
      {
        isSubmitted: req.body.isSubmitted,
        selectedMelody: selectedMelodyId,
        selectedPercussion: selectedPercussionId,
        selectedBass: selectedBassId
      }, function(err, submission) {
        if (err) return next(err);
        res.send(submission);
      });
}
