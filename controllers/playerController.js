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
          if (err) return next(err);
          if (player == null) {
            return res.render('mfh_error', {
              error: 'Player ID' + req.params.id + ' not found',
            });
          }
          next(err, player);
        });
    },

    // game
    function(player, next) {
      Game.findById(player.game)
        .populate('rounds')
        .populate('currentRound')
        .exec(function(err, game) {
          if (err) return next(err);
          next(err, player, game);
        });
    },

    // round
    function(player, game, next) {
      Round.findById(game.currentRound._id)
        .populate('submissions')
        .populate('winningSubmission')
        .populate('judge')
        .exec(function(err, round) {
          if (err) return next(err);
          next(err, player, game, round, round.submissions);
        });
    },

    // find selected lines for submitted submissions in given round
    function(player, game, round, submissions, next) {
      var submissionIds = round.submissions.map(x => x._id);

      Submission.find({ _id: { $in: submissionIds }, isSubmitted: true })
        .populate('player')
        .populate('selectedMelody')
        .populate('selectedBass')
        .populate('selectedPercussion')
        .exec(function(err, submissions) {
          if (err) return next(err);
          var linesFromSubmissions = submissions.map(function cb(submission, index, array) {
            var entry = { playerId: submission.player._id.toString(), submissionId: submission._id.toString(), lines: [] };
            if (submission.selectedMelody) entry.lines.push(submission.selectedMelody.toJSON);
            if (submission.selectedBass) entry.lines.push(submission.selectedBass.toJSON);
            if (submission.selectedPercussion) entry.lines.push(submission.selectedPercussion.toJSON);
            return entry;
          })
          next(err, player, game, round, submissions, linesFromSubmissions);
      });
    },

    // find submission that belongs to current player in this round
    function(player, game, round, submissions, linesFromSubmissions, next) {
      var submissionIds = round.submissions.map(x => x._id);
      console.log('submissionIds for current round', submissionIds);

      Submission.findOne({ _id: { $in: submissionIds }, player: player._id })
        .populate('player')
        .populate('melodyLines')
        .populate('bassLines')
        .populate('percussionLines')
        .populate('selectedMelody')
        .populate('selectedBass')
        .populate('selectedPercussion')
        .exec(function(err, submission) {
          if (err) return next(err);
          var isJudge = player._id.toString() == round.judge._id.toString();
          console.log('submission', submission);
          var results = {
            player: player,
            game: game,
            round: round,
            submission: submission,
            melodyLines: submission ? submission.melodyLines : [],
            bassLines: submission ? submission.bassLines : [],
            percussionLines: submission ? submission.percussionLines : [],
            submittedCount: linesFromSubmissions.length,
            expectedSubmissionCount: Math.max(round.submissions.length-1, 0),
            isJudge: isJudge,
            isSubmitted: submission ? submission.isSubmitted : false,
            linesFromSubmissions: linesFromSubmissions
          };
          next(err, results);
        });
    },

  ], function(err, results) {
    if (err) {
      return res.render('mfh_error', {
              error: 'Player ID ' + req.params.id + ' not found',
            });
    }
    results.allSubmissionsReceived = results.submittedCount == results.expectedSubmissionCount;
    if (results.isJudge) {
      res.render('judge', { title: 'Player', id: req.params.id, error: err, data: results })
    } if (results.isSubmitted) {
      res.render('submitted', { title: 'Player', id: req.params.id, error: err, data: results })
    } else {
      res.render('player', { title: 'Player', id: req.params.id, error: err, data: results })
    }
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
