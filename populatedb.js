#! /usr/bin/env node

console.log('This script populates your database. Specified database as argument - e.g.: populatedb mongodb://your_username:your_password@your_dabase_url');

//Get arguments passed on command line
var userArgs = process.argv.slice(2);
if (!userArgs[0].startsWith('mongodb://')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}

var async = require('async')
var Bass = require('./models/bass')
var Game = require('./models/game')
var Melody = require('./models/melody')
var Percussion = require('./models/percussion')
var Player = require('./models/player')
var Round = require('./models/round')
var Submission = require('./models/submission')


var mongoose = require('mongoose');
var mongoDB = userArgs[0];
mongoose.connect(mongoDB);
var db = mongoose.connection;
mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error:'));

var games = []
var bass_lines = []
var melody_lines = []
var percussion_lines = []
var players = []
var rounds = []
var submissions = []


function bassLineCreate(name, instrument, notesequence, notelength, cb) {
  var bass = new Bass({ name:name, instrument:instrument, notesequence:notesequence, notelength:notelength });

  bass.save(function (err) {
    if (err) {
      cb(err, null)
      return
    }
    console.log('New Bass line: ' + bass);
    bass_lines.push(bass)
    cb(null, bass)
  }  );
}


function melodyLineCreate(name, instrument, notesequence, notelength, cb) {
  var melody = new Melody({ name:name, instrument:instrument, notesequence:notesequence, notelength:notelength });

  melody.save(function (err) {
    if (err) {
      cb(err, null)
      return
    }
    console.log('New Melody line: ' + melody);
    melody_lines.push(melody)
    cb(null, melody)
  }  );
}


function percussionLineCreate(name, instrument, notesequence, notelength, cb) {
  var percussion = new Percussion({ name:name, instrument:instrument, notesequence:notesequence, notelength:notelength });

  percussion.save(function (err) {
    if (err) {
      cb(err, null)
      return
    }
    console.log('New Percussion line: ' + percussion);
    percussion_lines.push(percussion)
    cb(null, percussion)
  }  );
}


function playerCreate(name, game, winCount, cb) {
  var player = new Player({ name:name, game:game, winCount:winCount });

  player.save(function (err) {
    if (err) {
      cb(err, null)
      return
    }
    console.log('New Player: ' + player);
    players.push(player)
    cb(null, player)
  });
}


function submissionCreate(player, melodyLines, bassLines, percussionLines, selectedMelody, selectedBass, selectedPercussion, isSubmitted, cb) {
  var submissiondetail = {
    player: player,
    melodyLines: melodyLines,
    bassLines: bassLines,
    percussionLines: percussionLines,
    isSubmitted: isSubmitted
  }
  if (selectedPercussion != false) submissiondetail.selectedPercussion = selectedPercussion;
  if (selectedMelody != false) submissiondetail.selectedMelody = selectedMelody;
  if (selectedBass != false) submissiondetail.selectedBass = selectedBass;

  var submission = new Submission(submissiondetail);

  submission.save(function (err) {
    if (err) {
      cb(err, null)
      return
    }
    console.log('New Submission: ' + submission);
    submissions.push(submission)
    cb(null, submission)
  })
}


function roundCreate(roundNumber, videoURL, submissions, winningSubmission, judge, cb) {
  var rounddetail = {
    roundNumber: roundNumber,
    videoURL: videoURL,
    submissions: submissions,
    judge: judge
  }
  if (winningSubmission != false) rounddetail.winningSubmission = winningSubmission;

  var round = new Round(rounddetail);

  round.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log('New Round: ' + round);
    rounds.push(round)
    cb(null, round);
  }   );
}


function gameCreate(name, cb) {
  var game = new Game({ name:name, currentRound: null, rounds: [] });

  game.save(function (err) {
    if (err) {
      cb(err, null)
      return
    }
    console.log('New Game: ' + game);
    games.push(game)
    cb(null, game)
  }  );
}


var melody_instrument_0 = 0
var melody_times_0 = {54: [20.0],
  55: [16.0, 24.0],
  57: [12.0, 28.0],
  59: [8.0],
  61: [4.0],
  62: [0.0]}
var melody_dur_0 = 3.8

var melody_instrument_1 = 65
var melody_times_1 = {57: [20.0],
  59: [16.0, 24.0],
  61: [12.0, 28.0],
  62: [8.0],
  64: [4.0],
  66: [0.0]}
var melody_dur_1 = 3.8

var melody_instrument_2 = 0
var melody_times_2 = {57: [20.0],
  59: [16.0, 24.0],
  61: [12.0, 28.0],
  62: [8.0],
  64: [4.0],
  66: [0.0]}
var melody_dur_2 = 3.8

var melody_instrument_3 = 0
var melody_times_3 = {66: [20.0],
  67: [16.0, 24.0],
  69: [12.0, 28.0],
  71: [8.0],
  73: [4.0],
  74: [0.0]}
var melody_dur_3 = 3.8

var melody_instrument_4 = 65
var melody_times_4 = {61: [4.0],
  62: [3.0, 8.0],
  64: [6.0, 28.0, 31.0],
  66: [7.0, 27.0, 30.0],
  67: [26.0, 29.0],
  69: [5.0, 25.0],
  71: [11.0, 24.0],
  73: [1.0, 10.0, 12.0, 23.0],
  74: [0.0, 2.0, 9.0, 22.0],
  76: [18.0, 21.0],
  78: [13.0, 17.0, 20.0],
  79: [16.0, 19.0],
  81: [14.0],
  83: [15.0]}
var melody_dur_4 = 0.8

var melody_instrument_5 = 0
var melody_times_5 = {0: [0.5, 2.5, 8.5, 10.5, 16.5, 18.5, 24.5, 26.5],
  62: [21.0],
  64: [19.5, 20.5, 21.5],
  66: [11.0, 14.5, 19.0, 20.0, 22.0],
  67: [11.5, 13.5, 15.0, 16.0, 18.0, 22.5, 24.0],
  69: [4.5, 12.0, 13.0, 14.0, 15.5, 17.5, 23.0, 25.5, 28.0],
  71: [5.0, 12.5, 17.0, 23.5, 25.0, 26.0, 28.5],
  73: [5.5, 27.0, 29.0],
  74: [6.0, 9.0, 27.5, 29.5],
  76: [6.5, 9.5, 30.0],
  78: [1.0, 3.0, 7.0, 8.0, 10.0, 30.5],
  79: [1.5, 3.5, 7.5, 31.0],
  81: [0.0, 2.0, 4.0, 31.5]}
var melody_dur_5 = 0.4

var percussion_times_0 = {50: [0.0, 1.0, 1.5, 2.25, 2.5, 3.0, 3.5,
    4.0, 5.0, 5.5, 6.25, 6.5, 7.0, 7.5,
    8.0, 9.0, 9.5, 10.25, 10.5, 11.0, 11.5,
    12.0, 13.0, 13.5, 14.25, 14.5, 15.0, 15.5,
    16.0, 17.0, 17.5, 18.25, 18.5, 19.0, 19.5,
    20.0, 21.0, 21.5, 22.25, 22.5, 23.0, 23.5,
    24.0, 25.0, 25.5, 26.25, 26.5, 27.0, 27.5,
    28.0, 29.0, 29.5, 30.25, 30.5, 31.0, 31.5]}
var percussion_dur_0 = 0.2

var percussion_times_1 = {50: [0.0, 1.5, 2.0, 2.5, 3.5,
    4.0, 5.5, 6.0, 6.5, 7.5,
    8.0, 9.5, 10.0, 10.5, 11.5,
    12.0, 13.5, 14.0, 14.5, 15.5,
    16.0, 17.5, 18.0, 18.5, 19.5,
    20.0, 21.5, 22.0, 22.5, 23.5,
    24.0, 25.5, 26.0, 26.5, 27.5,
    28.0, 29.5, 30.0, 30.5, 31.5]}
var percussion_dur_1 = 0.4

var percussion_times_2 = {50: [0.0, 2.5, 4.0, 6.5,
    8.0, 10.5, 12.0, 14.5,
    16.0, 18.5, 20.0, 22.5,
    24.0, 26.5, 28.0, 30.5]}
var percussion_dur_2 = 1.2

var percussion_times_3 = {50: [0.0, 1.0, 2.0, 3.0,
    4.0, 5.0, 6.0, 7.0,
    8.0, 9.0, 10.0, 11.0,
    12.0, 13.0, 14.0, 15.0,
    16.0, 17.0, 18.0, 19.0,
    20.0, 21.0, 22.0, 23.0,
    24.0, 25.0, 26.0, 27.0,
    28.0, 29.0, 30.0, 31.0]}
var percussion_dur_3 = 0.9

var percussion_times_4 = {50: [0.0, 0.25, 0.5, 0.75, 1.0, 1.25, 1.5, 1.75,
    2.0, 2.25, 2.5, 2.75, 3.0, 3.25, 3.5, 3.75,
    4.0, 4.25, 4.5, 4.75, 5.0, 5.25, 5.5, 5.75,
    6.0, 6.25, 6.5, 6.75, 7.0, 7.25, 7.5, 7.75,
    8.0, 8.25, 8.5, 8.75, 9.0, 9.25, 9.5, 9.75,
    10.0, 10.25, 10.5, 10.75, 11.0, 11.25, 11.5, 11.75,
    12.0, 12.25, 12.5, 12.75, 13.0, 13.25, 13.5, 13.75,
    14.0, 14.25, 14.5, 14.75, 15.0, 15.25, 15.5, 15.75,
    16.0, 16.25, 16.5, 16.75, 17.0, 17.25, 17.5, 17.75,
    18.0, 18.25, 18.5, 18.75, 19.0, 19.25, 19.5, 19.75,
    20.0, 20.25, 20.5, 20.75, 21.0, 21.25, 21.5, 21.75,
    22.0, 22.25, 22.5, 22.75, 23.0, 23.25, 23.5, 23.75,
    24.0, 24.25, 24.5, 24.75, 25.0, 25.25, 25.5, 25.75,
    26.0, 26.25, 26.5, 26.75, 27.0, 27.25, 27.5, 27.75,
    28.0, 28.25, 28.5, 28.75, 29.0, 29.25, 29.5, 29.75,
    30.0, 30.25, 30.5, 30.75, 31.0, 31.25, 31.5, 31.75]}
var percussion_dur_4 = 0.2

var percussion_times_5 = {50: [0.0, 1.5, 2.0, 3.5, 4.0, 5.5, 6.0, 7.5,
    8.0, 9.5, 10.0, 11.5, 12.0, 13.5, 14.0, 15.5,
    16.0, 17.5, 18.0, 19.5, 20.0, 21.5, 22.0, 23.5,
    24.0, 25.5, 26.0, 27.5, 28.0, 29.5, 30.0, 31.5]}
var percussion_dur_5 = 0.4

var percussion_times_6 = {50: [0.5, 1.5, 2.5, 3.5, 4.5, 5.5, 6.5, 7.5,
    8.5, 9.5, 10.5, 11.5, 12.5, 13.5, 14.5, 15.5,
    16.5, 17.5, 18.5, 19.5, 20.5, 21.5, 22.5, 23.5,
    24.5, 25.5, 26.5, 27.5, 28.5, 29.5, 30.5, 31.5]}
var percussion_dur_6 = 0.9

var bass_instrument_0 = 0
var bass_times_0 = {0: [0.5, 1.0, 2.5, 3.0, 8.5, 9.0, 10.5, 11.0, 16.5, 17.0, 18.5, 19.0, 20.5, 21.0, 21.5, 22.5, 23.0, 23.5, 28.5, 29.0, 29.5, 30.5, 31.0, 31.5],
  59: [16.0],
  61: [13.5],
  62: [8.0, 9.5, 12.0, 13.0, 18.0],
  64: [5.5, 12.5, 15.5],
  66: [0.0, 1.5, 4.0, 5.0, 10.0, 11.5, 14.0, 15.0, 20.0],
  67: [4.5, 7.5, 14.5, 17.5, 25.0],
  69: [2.0, 3.5, 6.0, 7.0, 22.0, 24.5, 25.5, 28.0],
  71: [6.5, 19.5, 24.0, 27.0],
  72: [26.5, 27.5],
  73: [30.0],
  74: [26.0]}
var bass_dur_0 = 0.4

var bass_instrument_1 = 65
var bass_times_1 = {59: [16.0],
  62: [0.0],
  64: [12.0, 24.0],
  66: [8.0, 20.0],
  67: [18.0],
  69: [4.0, 14.0, 22.0, 28.0],
  71: [10.0],
  73: [6.0, 30.0],
  74: [2.0, 26.0]}
var bass_dur_1 = 1.9

var bass_instrument_2 = 0
var bass_times_2 = {38: [20.0],
  42: [12.0, 21.0],
  43: [16.0, 24.0],
  45: [4.0, 13.0, 22.0, 28.0],
  47: [8.0, 17.0, 25.0],
  49: [5.0, 14.0, 29.0],
  50: [0.0, 9.0, 18.0, 23.0, 26.0],
  52: [6.0, 30.0],
  54: [1.0, 10.0, 15.0],
  55: [19.0, 27.0],
  57: [2.0, 7.0, 31.0],
  59: [11.0],
  62: [3.0]}
var bass_dur_2 = 0.9


// name, instrument, notesequence, notelength
function createMusicLines(cb) {
    async.parallel([
        function(callback) {
          bassLineCreate('bass 1', bass_instrument_0, bass_times_0, bass_dur_0, callback);
        },
        function(callback) {
          bassLineCreate('bass 2', bass_instrument_1, bass_times_1, bass_instrument_1, callback);
        },
        function(callback) {
          bassLineCreate('bass 3', bass_instrument_2, bass_times_2, bass_instrument_2, callback);
        },
        function(callback) {
          bassLineCreate('bass 4', bass_instrument_1, bass_times_1, bass_instrument_2, callback);
        },
        function(callback) {
          bassLineCreate('bass 5', bass_instrument_0, bass_times_0, bass_dur_1, callback);
        },
        function(callback) {
          melodyLineCreate('melody 1', melody_instrument_0, melody_times_0, melody_dur_0, callback);
        },
        function(callback) {
          melodyLineCreate('melody 2', melody_instrument_1, melody_times_1, melody_dur_1, callback);
        },
        function(callback) {
          melodyLineCreate('melody 3', melody_instrument_2, melody_times_2, melody_dur_2, callback);
        },
        function(callback) {
          melodyLineCreate('melody 4', melody_instrument_3, melody_times_3, melody_dur_3, callback);
        },
        function(callback) {
          melodyLineCreate('melody 5', melody_instrument_4, melody_times_4, melody_dur_4, callback);
        },
        function(callback) {
          melodyLineCreate('melody 6', melody_instrument_5, melody_times_5, melody_dur_5, callback);
        },
        function(callback) {
          percussionLineCreate('percussion 1', 118, percussion_times_0, percussion_dur_0, callback);
        },
        function(callback) {
          percussionLineCreate('percussion 2', 118, percussion_times_1, percussion_dur_1, callback);
        },
        function(callback) {
          percussionLineCreate('percussion 3', 118, percussion_times_2, percussion_dur_2, callback);
        },
        function(callback) {
          percussionLineCreate('percussion 4', 118, percussion_times_3, percussion_dur_3, callback);
        },
        function(callback) {
          percussionLineCreate('percussion 5', 118, percussion_times_4, percussion_dur_4, callback);
        },
        function(callback) {
          percussionLineCreate('percussion 6', 118, percussion_times_5, percussion_dur_5, callback);
        },
        function(callback) {
          percussionLineCreate('percussion 7', 118, percussion_times_6, percussion_dur_6, callback);
        },
        ],
        // optional callback
        cb);
}


function createPlayers(cb) {
    async.series([
        function(callback) {
          playerCreate('Abigail', games[0], 1, callback);
        },
        function(callback) {
          playerCreate('Bob', games[0], 0, callback);
        },
        function(callback) {
          playerCreate('Charlie', games[0], 0, callback);
        },
        function(callback) {
          playerCreate('Danielle', games[0], 0, callback);
        },
        function(callback) {
          playerCreate('Emily', games[1], 0, callback);
        },
        function(callback) {
          playerCreate('Farah', games[1], 0, callback);
        },
        function(callback) {
          playerCreate('Giselle', games[1], 0, callback);
        },
        function(callback) {
          playerCreate('Hitch', games[1], 0, callback);
        },
        ],
        // optional callback
        cb);
}


function createSubmissions(cb) {
    async.series([
        function(callback) {
          submissionCreate(players[0], [melody_lines[0], melody_lines[1], melody_lines[3]], [bass_lines[1], bass_lines[2], bass_lines[4]], [percussion_lines[0], percussion_lines[1], percussion_lines[2]], melody_lines[0], bass_lines[2], percussion_lines[0], true, callback);
        },
        function(callback) {
          submissionCreate(players[0], [melody_lines[1], melody_lines[2], melody_lines[3]], [bass_lines[1], bass_lines[2], bass_lines[4]], [percussion_lines[0], percussion_lines[2], percussion_lines[5]], false, false, false, false, callback);
        },
        function(callback) {
          submissionCreate(players[1], [melody_lines[2], melody_lines[3], melody_lines[5]], [bass_lines[4], bass_lines[3], bass_lines[2]], [percussion_lines[0], percussion_lines[3], percussion_lines[6]], melody_lines[3], bass_lines[4], percussion_lines[0], true, callback);
        },
        function(callback) {
          submissionCreate(players[1], [melody_lines[3], melody_lines[4], melody_lines[0]], [bass_lines[1], bass_lines[2], bass_lines[4]], [percussion_lines[1], percussion_lines[2], percussion_lines[4]], false, false, false, false, callback);
        },
        function(callback) {
          submissionCreate(players[2], [melody_lines[4], melody_lines[3], melody_lines[2]], [bass_lines[1], bass_lines[2], bass_lines[4]], [percussion_lines[1], percussion_lines[2], percussion_lines[4]], melody_lines[3], bass_lines[4], percussion_lines[0], true, callback);
        },
        function(callback) {
          submissionCreate(players[2], [melody_lines[4], melody_lines[5], melody_lines[2]], [bass_lines[1], bass_lines[2], bass_lines[4]], [percussion_lines[1], percussion_lines[2], percussion_lines[4]], false, false, false, false, callback);
        },
        function(callback) {
          submissionCreate(players[3], [melody_lines[0], melody_lines[1], melody_lines[3]], [bass_lines[1], bass_lines[2], bass_lines[4]], [percussion_lines[0], percussion_lines[1], percussion_lines[2]], melody_lines[1], bass_lines[1], percussion_lines[0], true, callback);
        },
        function(callback) {
          submissionCreate(players[3], [melody_lines[2], melody_lines[3], melody_lines[5]], [bass_lines[1], bass_lines[2], bass_lines[4]], [percussion_lines[4], percussion_lines[6], percussion_lines[5]], false, false, false, false, callback);
        },
        function(callback) {
          submissionCreate(players[4], [melody_lines[0], melody_lines[1], melody_lines[3]], [bass_lines[1], bass_lines[2], bass_lines[4]], [percussion_lines[0], percussion_lines[1], percussion_lines[2]], false, false, false, false, callback);
        },
        function(callback) {
          submissionCreate(players[5], [melody_lines[2], melody_lines[3], melody_lines[5]], [bass_lines[4], bass_lines[3], bass_lines[2]], [percussion_lines[0], percussion_lines[3], percussion_lines[6]], melody_lines[3], bass_lines[4], percussion_lines[0], true, callback);
        },
        function(callback) {
          submissionCreate(players[6], [melody_lines[4], melody_lines[3], melody_lines[2]], [bass_lines[1], bass_lines[2], bass_lines[4]], [percussion_lines[1], percussion_lines[2], percussion_lines[4]], melody_lines[3], bass_lines[4], percussion_lines[1], true, callback);
        },
        function(callback) {
          submissionCreate(players[7], [melody_lines[0], melody_lines[1], melody_lines[3]], [bass_lines[1], bass_lines[2], bass_lines[4]], [percussion_lines[0], percussion_lines[1], percussion_lines[2]], melody_lines[1], bass_lines[1], percussion_lines[2], true, callback);
        },
      ], cb);
}


function createRounds(cb) {
    async.series([
        function(callback) {
          roundCreate(1, 'https://www.youtube.com/watch?v=W_B2UZ_ZoxU', [submissions[0], submissions[2], submissions[4], submissions[6]], submissions[4], players[0], callback);
        },
        function(callback) {
          roundCreate(2, 'https://www.youtube.com/watch?v=W_B2UZ_ZoxU', [submissions[1], submissions[3], submissions[5], submissions[7]], false, players[1], callback);
        },
        function(callback) {
          roundCreate(1, 'https://www.youtube.com/watch?v=W_B2UZ_ZoxU', [submissions[8], submissions[9], submissions[10], submissions[11]], false, players[4], callback);
        }
      ], cb);
}


function createGames(cb) {
    async.series([
      function(callback) {
        gameCreate('Too Cool for School', callback);
      },
      function(callback) {
        gameCreate('All Rounded Up', callback)
      }
    ], cb);
}


function updateGame0(cb) {
  games[0].update({ rounds: [rounds[0], rounds[1]], currentRound: rounds[1] }, function(err, game) {
    if (err) {
      cb(err, null)
      return
    }
    games[0] = game;
    console.log('Update Game: ' + game);
    cb(null, game)
  });
}

function updateGame1(cb) {
  games[1].update({ rounds: [rounds[2]], currentRound: rounds[2] }, function(err, game) {
    if (err) {
        cb(err, null)
        return
    }
    games[1] = game;
    console.log('Update Game: ' + game);
    cb(null, game)
  })
}

async.series([
    createMusicLines,
    createGames,
    createPlayers,
    createSubmissions,
    createRounds,
    updateGame0,
    updateGame1
],
// optional callback
function(err, results) {
    if (err) {
        console.log('FINAL ERR: '+err);
    }
    else {
        console.log('Game Instances: '+games);

    }
    //All done, disconnect from database
    mongoose.connection.close();
});
