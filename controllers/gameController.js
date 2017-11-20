var Game = require('../models/game');
var Player = require('../models/player');
var Round = require('../models/round');

var async = require('async');

exports.index = function(req, res) {

  async.parallel({
    game_count: function(callback) {
      Game.count(callback);
    },
    game_list: function(callback) {
      Game.find()
        .exec(callback);
    }
  }, function(err, results) {
    console.log(results);
    res.render('gameplay', { title: 'Play', error: err, data: results })
  });

};

// Display detail page for a specific Game
exports.game_detail = function(req, res) {

  async.waterfall([

    function(next) {
      Game.findById(req.params.id)
        .populate('currentRound')
        .exec(function(err, game) {
          if (err) return next(err);
          if (game == null) {
            return res.render('mfh_error', {
              error: 'Game ID ' + req.params.id + ' not found',
            });
          }
          next(err, game);
        });
    },

    function(game, next) {
      Round.findById(game.currentRound._id)
        .populate('judge')
        .exec(function(err, currentRound) {
          if (err) return next(err);
          next(err, game, currentRound);
        });
    },

    function(game, currentRound, next) {
      Player.find({ game: game })
        .sort([['name', 'ascending']])
        .exec(function(err, players) {
          if (err) return next(err);
          var results = {
            game: game,
            currentRound: currentRound,
            player_list: players
          }
          next(err, results);
        })
    }

  ], function(err, results) {
    if (err) {
      return res.render('mfh_error', {
        error: 'Game ID ' + req.params.id + ' not found',
      });
    }
    res.render('game_detail', { error: err, data: results, title: 'Join Game' })
  });

}

// Handle Game create on POST
exports.game_create_on_post = function(req, res) {
  res.send('NOT IMPLEMENTED: Game create POST');
}

// Handle Game update on POST
exports.game_update_on_post = function(req, res) {
  res.send('NOT IMPLEMENTED: Game update POST');
}
