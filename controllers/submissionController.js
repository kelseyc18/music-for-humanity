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
exports.submission_update_on_post = function(req, res) {
  res.send('NOT IMPLEMENTED: Submission update POST');
}
