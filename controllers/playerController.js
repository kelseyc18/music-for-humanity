var Player = require('../models/player');

// Display list of all Players
exports.player_list = function(req, res) {
  res.send('NOT IMPLEMENTED: Player list');
}

// Display detail page for a specific Player
exports.player_detail = function(req, res) {
  res.send('NOT IMPLEMENTED: Player detail: ' + req.params.id);
}

// Handle Player create on POST
exports.player_create_on_post = function(req, res) {
  res.send('NOT IMPLEMENTED: Player create POST');
}

// Handle Player update on POST
exports.player_update_on_post = function(req, res) {
  res.send('NOT IMPLEMENTED: Player update POST');
}
