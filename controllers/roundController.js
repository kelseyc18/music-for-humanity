var Round = require('../models/round');

// Display list of all Rounds
exports.round_list = function(req, res) {
  res.send('NOT IMPLEMENTED: Round list');
}

// Display detail page for a specific Round
exports.round_detail = function(req, res) {
  res.send('NOT IMPLEMENTED: Round detail: ' + req.params.id);
}

// Handle Round create on POST
exports.round_create_on_post = function(req, res) {
  res.send('NOT IMPLEMENTED: Round create POST');
}

// Handle Round update on POST
exports.round_update_on_post = function(req, res) {
  res.send('NOT IMPLEMENTED: Round update POST');
}
