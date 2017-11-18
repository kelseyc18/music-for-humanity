var Game = require('../models/game');
var Player = require('../models/player');
var Round = require('../models/round');
var Submission = require('../models/submission');
var Melody = require('../models/melody');
var Bass = require('../models/bass');
var Percussion = require('../models/percussion');

var async = require('async');

// Display detail page for a specific Player
exports.player_detail = function(req, res) {

  async.waterfall([

    // player
    function(next) {
      Player.findById(req.params.id)
        .exec(function(err, player) {
          if (err) console.log(err);
          next(err, player);
        });
    },

    // game
    function(player, next) {
      Game.findById(player.game)
        .limit(1)
        .populate('rounds')
        .populate('currentRound')
        .exec(function(err, game) {
          if (err) console.log(err);
          next(err, player, game);
        });
    },

    // round
    function(player, game, next) {
      Round.findById(game.currentRound._id)
        .limit(1)
        .populate('submissions')
        .populate('winningSubmission')
        .populate('judge')
        .exec(function(err, round) {
          if (err) console.log(err);
          next(err, player, game, round, round.submissions);
        });
    },

    // submission
    function(player, game, round, submissions, next) {
      Submission.find({ player: player })
        .limit(1)
        .populate('player')
        .populate('melodyLines')
        .populate('bassLines')
        .populate('percussionLines')
        .populate('selectedMelody')
        .populate('selectedBass')
        .populate('selectedPercussion')
        .exec(function(err, submission) {
          if (err) console.log(err);
          var results = {
            player: player,
            game: game,
            round: round,
            submission: submission,
          }
          next(err, results)
        });
    }

  ], function(err, results) {
    if (err) console.log(err);
    res.render('player', { title: 'Player', id: req.params.id, error: err, data: results })
  });

}

// Handle Player create on POST
exports.player_create_on_post = function(req, res) {
  res.send('NOT IMPLEMENTED: Player create POST');
}

// Handle Player update on POST
exports.player_update_on_post = function(req, res) {
  res.send('NOT IMPLEMENTED: Player update POST');
}
