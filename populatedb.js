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


function bassLineCreate(name, url, cb) {  
  var bass = new Bass({ name:name, url:url });
       
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


function melodyLineCreate(name, url, cb) {  
  var melody = new Melody({ name:name, url:url });
       
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


function percussionLineCreate(name, url, cb) {  
  var percussion = new Percussion({ name:name, url:url });
       
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


function playerCreate(name, cb) {
  var player = new Player({ name:name, winCount:0 });

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


function submissionCreate(player, melodyLines, bassLines, percussionLines, selectedMelody, selectedBass, selectedPercussion, cb) {
  var submissiondetail = {
    player: player,
    melodyLines: melodyLines,
    bassLines: bassLines,
    percussionLines: percussionLines
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
  if (winningSubmission != false) rounddetail.winningSubmission = winningSubmission

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


function gameCreate(rounds, players, cb) {  
  var game = new Game({ rounds: rounds, players: players });
       
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


function createMusicLines(cb) {
    async.parallel([
        function(callback) {
          bassLineCreate('bass 1', 'http://www.mediafire.com/file/c8j4n4i91aleugj/Relaxing_Meditation.mp3', callback);
        },
        function(callback) {
          bassLineCreate('bass 2', 'http://www.mediafire.com/file/c8j4n4i91aleugj/Relaxing_Meditation.mp3', callback);
        },
        function(callback) {
          bassLineCreate('bass 3', 'http://www.mediafire.com/file/c8j4n4i91aleugj/Relaxing_Meditation.mp3', callback);
        },
        function(callback) {
          bassLineCreate('bass 4', 'http://www.mediafire.com/file/c8j4n4i91aleugj/Relaxing_Meditation.mp3', callback);
        },
        function(callback) {
          bassLineCreate('bass 5', 'http://www.mediafire.com/file/c8j4n4i91aleugj/Relaxing_Meditation.mp3', callback);
        },
        function(callback) {
          melodyLineCreate('melody 1', 'http://www.mediafire.com/file/dhqxn0c0x1m4tn3/Depression_Relief.mp3', callback);
        },
        function(callback) {
          melodyLineCreate('melody 2', 'http://www.mediafire.com/file/dhqxn0c0x1m4tn3/Depression_Relief.mp3', callback);
        },
        function(callback) {
          melodyLineCreate('melody 3', 'http://www.mediafire.com/file/dhqxn0c0x1m4tn3/Depression_Relief.mp3', callback);
        },
        function(callback) {
          melodyLineCreate('melody 4', 'http://www.mediafire.com/file/dhqxn0c0x1m4tn3/Depression_Relief.mp3', callback);
        },
        function(callback) {
          melodyLineCreate('melody 5', 'http://www.mediafire.com/file/dhqxn0c0x1m4tn3/Depression_Relief.mp3', callback);
        },
        function(callback) {
          percussionLineCreate('percussion 1', 'http://www.mediafire.com/file/tt1slb20v7q0h9x/Sound_Sleep.mp3', callback);
        },
        function(callback) {
          percussionLineCreate('percussion 2', 'http://www.mediafire.com/file/tt1slb20v7q0h9x/Sound_Sleep.mp3', callback);
        },
        function(callback) {
          percussionLineCreate('percussion 3', 'http://www.mediafire.com/file/tt1slb20v7q0h9x/Sound_Sleep.mp3', callback);
        },
        function(callback) {
          percussionLineCreate('percussion 4', 'http://www.mediafire.com/file/tt1slb20v7q0h9x/Sound_Sleep.mp3', callback);
        },
        function(callback) {
          percussionLineCreate('percussion 5', 'http://www.mediafire.com/file/tt1slb20v7q0h9x/Sound_Sleep.mp3', callback);
        },
        ],
        // optional callback
        cb);
}


function createPlayers(cb) {
    async.parallel([
        function(callback) {
          playerCreate('Abigail', callback);
        },
        function(callback) {
          playerCreate('Bob', callback);
        },
        function(callback) {
          playerCreate('Charlie', callback);
        },
        function(callback) {
          playerCreate('Danielle', callback);
        },
        ],
        // optional callback
        cb);
}


function createSubmissions(cb) {
    async.parallel([
        function(callback) {
          submissionCreate(players[0], [melody_lines[0], melody_lines[3]], [bass_lines[1], bass_lines[2], bass_lines[4]], [percussion_lines[0]], melody_lines[0], bass_lines[2], percussion_lines[0], callback);
        },
        function(callback) {
          submissionCreate(players[0], [melody_lines[1], melody_lines[3]], [bass_lines[1], bass_lines[2], bass_lines[4]], [percussion_lines[0]], false, false, false, callback);
        },
        function(callback) {
          submissionCreate(players[1], [melody_lines[2], melody_lines[3]], [bass_lines[1], bass_lines[2], bass_lines[4]], [percussion_lines[0]], melody_lines[3], bass_lines[4], percussion_lines[0], callback);
        },
        function(callback) {
          submissionCreate(players[1], [melody_lines[3]], [bass_lines[1], bass_lines[2], bass_lines[4]], [percussion_lines[0]], false, false, false, callback);
        },
        function(callback) {
          submissionCreate(players[2], [melody_lines[4], melody_lines[3]], [bass_lines[1], bass_lines[2], bass_lines[4]], [percussion_lines[0]], melody_lines[3], bass_lines[4], percussion_lines[0], callback);
        },
        function(callback) {
          submissionCreate(players[2], [melody_lines[0], melody_lines[3]], [bass_lines[1], bass_lines[2], bass_lines[4]], [percussion_lines[0]], false, false, false, callback);
        },
        function(callback) {
          submissionCreate(players[3], [melody_lines[1], melody_lines[3]], [bass_lines[1], bass_lines[2], bass_lines[4]], [percussion_lines[0]], melody_lines[1], bass_lines[1], percussion_lines[0], callback);
        },
        function(callback) {
          submissionCreate(players[3], [melody_lines[2], melody_lines[3]], [bass_lines[1], bass_lines[2], bass_lines[4]], [percussion_lines[0]], false, false, false, callback);
        },
      ], cb);
}


function createRounds(cb) {
    async.parallel([
        function(callback) {
          roundCreate(1, 'https://www.youtube.com/watch?v=W_B2UZ_ZoxU', [submissions[0], submissions[2], submissions[4], submissions[6]], submissions[4], players[0], callback);
        },
        function(callback) {
          roundCreate(2, 'https://www.youtube.com/watch?v=W_B2UZ_ZoxU', [submissions[1], submissions[3], submissions[5], submissions[7]], submissions[3], players[1], callback);
        },
      ], cb);
}


function createGames(cb) {
    async.parallel([
      function(callback) {
        gameCreate([rounds[0], rounds[1]], players, callback);
      }
    ], cb);
}



async.series([
    createMusicLines,
    createPlayers,
    createSubmissions,
    createRounds,
    createGames
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



