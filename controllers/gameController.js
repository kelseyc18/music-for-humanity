var Game = require('../models/game');
var Player = require('../models/player');

var async = require('async');

exports.index = function(req, res) {

  async.parallel({
    game_count: function(callback) {
      Game.count(callback);
    },
    game_list: function(callback) {
      Game.find({}, 'rounds')
        .populate('rounds')
        .exec(callback);
    }
  }, function(err, results) {
    res.render('gameplay', { title: 'Play', error: err, data: results })
  });

};

// Display detail page for a specific Game
exports.game_detail = function(req, res) {
  res.send('NOT IMPLEMENTED: Game detail: ' + req.params.id);
}

// Handle Game create on POST
exports.game_create_on_post = function(req, res) {
  res.send('NOT IMPLEMENTED: Game create POST');
}

// Handle Game update on POST
exports.game_update_on_post = function(req, res) {
  res.send('NOT IMPLEMENTED: Game update POST');
}
