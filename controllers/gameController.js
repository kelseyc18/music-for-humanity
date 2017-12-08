var Game = require('../models/game');
var Player = require('../models/player');
var Round = require('../models/round');
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
  return Array.from(selectedLines);
}

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

  async.waterfall([

    // create game
    function(next) {
      Game.create({ name: req.body.gameName }, function(err, game) {
        if (err) return next(err);
        next(err, game);
      })
    },

    // create 4 players
    function(game, next) {
      players_list = []
      players_list.push({ game: game._id, name: req.body.player_name1 });
      players_list.push({ game: game._id, name: req.body.player_name2 });
      players_list.push({ game: game._id, name: req.body.player_name3 });
      players_list.push({ game: game._id, name: req.body.player_name4 });

      Player.create(players_list, function(err, players) {
        if (err) return next(err);
        return next(err, game);
      })
    },

    ///////////////////////
    // PREPARE NEW ROUND //
    ///////////////////////

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
      var newRoundNumber = 1;
      var round = {
        roundNumber: 1,
        videoId: getVideoId(newRoundNumber),
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
      console.log('update game');
      Game.findByIdAndUpdate(game._id, { currentRound: round, $push: { rounds: round } }, function(err, game) {
        if (err) return next(err);
        next(err, game._id);
      })
    }

  ], function(err, results) {
    if (err) {
      return res.send(err);
    }
    return res.send(results);
  })

}

exports.new_game = function(req, res) {
  res.render('new_game', { title: 'New Game' })
}

// Handle Game update on POST
exports.game_update_on_post = function(req, res) {
  res.send('NOT IMPLEMENTED: Game update POST');
}
