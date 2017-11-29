var mongoose = require('mongoose');
var Round = require('../models/round');
var Player = require('../models/player');
var Game = require('../models/game');
var Melody = require('../models/melody');
var Percussion = require('../models/percussion');
var Bass = require('../models/bass');
var Submission = require('../models/submission');

var async = require('async');

videoIds = ['GV9-R7WOM-o', 'AbeABOfx82Q', 'pbVt1F-6kbo', 'CgSNxHQLt7g', '0tACkMMDN80', 'xJO7esEF7lo']

const LINE_SELECTION_PER_ROUND = 3;

function getVideoId(roundNumber) {
  return videoIds[roundNumber % videoIds.length]
}

function getJudge(players, roundNumber) {
  return players[(roundNumber - 1) % players.length]
}

function getRandomLines(lineInventory, selectionNumber) {
  var numToSelect = Math.min(lineInventory.length, selectionNumber);
  var selectedLines = new Set();

  for(var i=0; i < numToSelect; i++) {
    var item = lineInventory[Math.floor(Math.random()*lineInventory.length)];
    while (selectedLines.has(item)) {
      item = lineInventory[Math.floor(Math.random()*lineInventory.length)];
    }
    selectedLines.add(item);
  }
  console.log('getRandomLines', selectedLines);
  return Array.from(selectedLines);
}

// Display list of all Rounds
exports.round_list = function(req, res) {
  res.send('NOT IMPLEMENTED: Round list');
}

// Display detail page for a specific Round
exports.round_detail = function(req, res) {
  res.send('NOT IMPLEMENTED: Round detail: ' + req.params.id);
}

exports.round_reset_submissions = function(req, res) {
  async.waterfall([

    function(next) {
      Round.findById(mongoose.Types.ObjectId(req.body.roundId))
        .populate('submissions')
        .exec(function(err, round) {
          if (err) return next(err);
          next(err, round);
        })
    },

    function(round, next) {
      var submissionIds = round.submissions.map(x => x._id);

      console.log(submissionIds);
      Submission.update({ _id: { $in: submissionIds } }, { $set: { isSubmitted: false } }, { multi: true } )
        .exec(function(err, numAffected) {
          console.log(numAffected)
          if (err) return next(err);
          next(err, numAffected);
        })

    }

  ], function(err, numAffected) {
    if (err) return res.send(err);
    res.send(numAffected);
  });
}

// Handle Round create on POST
exports.round_create_on_post = function(req, res) {

  async.waterfall([

    // find game
    function(next) {
      Game.findById(mongoose.Types.ObjectId(req.body.gameId))
        .populate('currentRound')
        .exec(function(err, game) {
          if (err) return next(err);
          next(err, game);
        })
    },

    // find players
    function(game, next) {
      Player.find({ game: game })
        .sort([['name', 'ascending']])
        .exec(function(err, players) {
          if (err) return next(err);
          next(err, game, players);
      })
    },

    // find melodies
    function(game, players, next) {
      Melody.find({}, function(err, melodies) {
        if (err) return next(err);
        next(err, game, players, melodies);
      })
    },

    // find percussion
    function(game, players, melodies, next) {
      Percussion.find({}, function(err, percussions) {
        if (err) return next(err);
        next(err, game, players, melodies, percussions);
      })
    },

    // find bass
    function(game, players, melodies, percussions, next) {
      Bass.find({}, function(err, basses) {
        if (err) return next(err);
        next(err, game, players, melodies, percussions, basses);
      })
    },

    // create submissions for each player
    function(game, players, melodies, percussions, basses, next) {
      submission_array = []
      players.forEach(function(player, index) {
        submission_array.push({
          player: player,
          melodyLines: getRandomLines(melodies, LINE_SELECTION_PER_ROUND),
          bassLines: getRandomLines(basses, LINE_SELECTION_PER_ROUND),
          percussionLines: getRandomLines(percussions, LINE_SELECTION_PER_ROUND),
        });
      });

      Submission.create(submission_array, function(err, submissions) {
        if (err) return next(err);
        next(err, game, players, submissions);
      })
    },

    // create new round
    function(game, players, submissions, next) {
      var newRoundNumber = game.currentRound.roundNumber + 1;
      var round = {
        roundNumber: newRoundNumber,
        videoID: getVideoId(newRoundNumber),
        submissions: submissions,
        judge: getJudge(players, newRoundNumber)
      };

      Round.create(round, function(err, round) {
        if (err) return next(err);
        next(err, game, round);
      });
    },

    // update game
    function(game, round, next) {
      Game.findByIdAndUpdate(game._id, { currentRound: round, $push: { rounds: round } }, function(err, game) {
        if (err) return next(err);
        next(err, round);
      })
    }

  ], function(err, results) {
    if (err) return res.send(err);
    res.send(results);
  });

}

// Handle Round update on POST
exports.round_update_on_post = function(req, res) {
  res.send('NOT IMPLEMENTED: Round update POST');
}

exports.round_set_winner_on_post = function(req, res) {
  async.waterfall([

    function(next) {
      Submission.findById(req.body.submissionId)
        .populate('player')
        .exec(function(err, submission) {
          if (err) return next(err);
          next(err, submission);
        })
    },

    function(submission, next) {
      Round.findByIdAndUpdate(req.body.roundId, { winningSubmission: submission } )
        .exec(function(err, round) {
          if (err) return next(err);
          next(err, submission, round);
        });
    },

    function(submission, round, next) {
      console.log('winning submission player id', submission.player._id.toString());
      Player.findByIdAndUpdate(submission.player._id, { $inc: { winCount: 1 } })
        .exec(function(err, player) {
          if (err) return next(err);
          var result = {
            submission: submission,
            round: round,
            player: player,
          }
          console.log('result', result);
          next(err, result)
        })
    },

  ], function(err, result) {
    if (err) return res.send(err);
    res.send(result);
  });
}

exports.round_clear_winner_on_post = function(req, res) {
  async.waterfall([

    function(next) {
      Round.findById(req.body.roundId)
        .populate('winningSubmission')
        .exec(function(err, round) {
          if (err) return next(err);
          next(err, round, round.winningSubmission);
        });
    },

    function(round, winningSubmission, next) {
      Round.findByIdAndUpdate(round._id, { winningSubmission: undefined })
        .exec(function(err, round) {
          if (err) return next(err);
          next(err, round, winningSubmission);
        });
    },

    function(round, winningSubmission, next) {
      Submission.findById(winningSubmission._id)
        .populate('player')
        .exec(function(err, submission) {
          if (err) return next(err);
          next(err, round, submission);
        })
    },

    function(round, submission, next) {
      Player.findByIdAndUpdate(submission.player._id, { $inc: { winCount: -1 } })
        .exec(function(err, player) {
          if (err) return next(err);
          var result = {
            submission: submission,
            round: round,
            player: player,
          }
          next(err, result)
        })
    },

  ], function(err, result) {
    if (err) return res.send(err);
    res.send(result);
  });
}
