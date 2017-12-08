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


function submissionCreate(player, melodyLines, bassLines, percussionLines, selectedMelody, selectedBass, selectedPercussion, isSubmitted, tempo, cb) {
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
  if (tempo != false) submissiondetail.tempo = tempo;

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


function roundCreate(roundNumber, videoId, submissions, winningSubmission, judge, cb) {
  var rounddetail = {
    roundNumber: roundNumber,
    videoId: videoId,
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

/////////////////////////////////////////////////////////
///                  MELODY SELECTION                 ///
/////////////////////////////////////////////////////////

var melody_instrument_0 = 41
var melody_times_0 = {64: [0.0, 12.0], 0: [5.0, 6.0, 7.0, 13.0, 14.0, 15.0], 69: [1.0, 9.0], 65: [4.0, 8.0], 72.0: [3.0, 11.0], 71.0: [2.0, 10.0]}
var melody_dur_0 = 0.9
var melody_instrument_1 = 41
var melody_times_1 = {64: [0.0, 12.0], 0: [5.0, 6.0, 7.0, 13.0, 14.0, 15.0], 69: [1.0, 11.0], 65: [4.0], 72.0: [3.0, 9.0], 74.0: [8.0], 71.0: [2.0, 10.0]}
var melody_dur_1 = 0.9
var melody_instrument_2 = 43
var melody_times_2 = {64: [8.0, 12.0], 57.0: [0.0, 4.0, 8.0, 12.0], 60: [4.0, 8.0, 12.0], 69: [12.0]}
var melody_dur_2 = 3.9
var melody_instrument_3 = 43
var melody_times_3 = {64: [8.0, 10.0, 12.0, 14.0], 57.0: [0.0, 2.0, 4.0, 6.0, 8.0, 10.0, 12.0, 14.0], 60: [4.0, 6.0, 8.0, 10.0, 12.0, 14.0], 69: [12.0, 14.0]}
var melody_dur_3 = 1.9
var melody_instrument_4 = 43
var melody_times_4 = {64: [8.0, 9.0, 10.0, 11.0, 12.0, 13.0, 14.0, 15.0], 57.0: [0.0, 1.0, 2.0, 3.0, 4.0, 5.0, 6.0, 7.0, 8.0, 9.0, 10.0, 11.0, 12.0, 13.0, 14.0, 15.0], 60: [4.0, 5.0, 6.0, 7.0, 8.0, 9.0, 10.0, 11.0, 12.0, 13.0, 14.0, 15.0], 69: [12.0, 13.0, 14.0, 15.0]}
var melody_dur_4 = 0.9
var melody_instrument_5 = 43
var melody_times_5 = {64: [8.0, 8.5, 9.0, 9.5, 10.0, 10.5, 11.0, 11.5, 12.0, 12.5, 13.0, 13.5, 14.0, 14.5, 15.0, 15.5], 57.0: [0.0, 0.5, 1.0, 1.5, 2.0, 2.5, 3.0, 3.5, 4.0, 4.5, 5.0, 5.5, 6.0, 6.5, 7.0, 7.5, 8.0, 8.5, 9.0, 9.5, 10.0, 10.5, 11.0, 11.5, 12.0, 12.5, 13.0, 13.5, 14.0, 14.5, 15.0, 15.5], 60: [4.0, 4.5, 5.0, 5.5, 6.0, 6.5, 7.0, 7.5, 8.0, 8.5, 9.0, 9.5, 10.0, 10.5, 11.0, 11.5, 12.0, 12.5, 13.0, 13.5, 14.0, 14.5, 15.0, 15.5], 69: [12.0, 12.5, 13.0, 13.5, 14.0, 14.5, 15.0, 15.5]}
var melody_dur_5 = 0.4
var melody_instrument_6 = 1
var melody_times_6 = {64: [0.0, 1.5, 4.0, 5.5, 10.0, 13.0], 0: [1.0, 2.5, 3.5, 5.0, 6.5, 7.5, 12.5, 13.5, 14.5, 15.0, 15.5], 67: [0.5, 4.5, 9.0], 69: [8.5], 65: [9.5], 71.0: [8.0], 72.0: [7.0], 59: [11.5], 60: [2.0, 3.0, 6.0, 11.0, 12.0, 14.0], 62: [10.5]}
var melody_dur_6 = 0.4
var melody_instrument_7 = 57
var melody_times_7 = {0: [1.0, 5.0, 6.0, 7.0, 9.0, 13.0, 14.0, 15.0], 65: [2.0, 3.0, 4.0, 12.0], 67: [10.0], 60: [0.0, 8.0], 64: [11.0]}
var melody_dur_7 = 0.9
var melody_instrument_8 = 43
var melody_times_8 = {64: [4.0, 12.0], 0: [5.0, 6.0, 9.0, 10.0, 11.0, 13.0, 14.0, 15.0], 65: [8.0], 48.0: [0.0], 55.0: [1.0], 60: [2.0], 62: [3.0, 7.0]}
var melody_dur_8 = 0.9
var melody_instrument_9 = 43
var melody_times_9 = {0: [1.0, 2.0, 3.0, 4.0, 5.0, 9.0, 13.0, 14.0], 65: [6.0, 11.0], 67: [0.0, 7.0, 10.0, 12.0, 15.0], 69: [8.0]}
var melody_dur_9 = 0.9
var melody_instrument_10 = 41
var melody_times_10 = {64: [0.0, 1.0, 2.0, 3.0, 8.0, 10.0], 0: [5.0, 6.0, 13.0, 14.0, 15.0], 65: [9.0], 57.0: [12.0], 60: [11.0], 62: [4.0, 7.0]}
var melody_dur_10 = 0.9
var melody_instrument_11 = 41
var melody_times_11 = {0: [0.0, 0.5, 4.5, 5.0, 5.5, 6.0, 6.5, 7.0, 7.5, 8.0, 8.5, 12.5, 13.0, 13.5, 14.0, 14.5, 15.0, 15.5], 64: [2.5], 52.0: [11.0, 12.0], 53.0: [10.5, 11.5], 55.0: [3.5, 9.0, 9.5, 10.0], 57.0: [1.0, 4.0], 59: [1.5], 60: [2.0], 62: [3.0]}
var melody_dur_11 = 0.4
var melody_instrument_12 = 43
var melody_times_12 = {64: [0.0], 60: [4.0], 62: [8.0], 55.0: [12.0]}
var melody_dur_12 = 3.9
var melody_instrument_13 = 1
var melody_times_13 = {0: [0.5, 2.0, 2.5, 3.0, 3.5, 4.0, 4.5, 5.0, 5.5, 8.5, 10.0, 10.5, 11.5, 12.5, 13.0, 13.5], 64: [7.5, 11.0, 12.0, 15.5], 60: [1.0, 1.5, 6.5, 9.0, 14.5], 62: [0.0, 7.0, 8.0, 9.5, 15.0], 55.0: [6.0, 14.0]}
var melody_dur_13 = 0.4

/////////////////////////////////////////////////////////
///                   BASS SELECTION                  ///
/////////////////////////////////////////////////////////

var bass_instrument_0 = 1
var bass_times_0 = {36: [0.0, 12.0], 40: [1.0, 13.0], 41: [4.0], 43: [2.0, 8.0, 14.0], 45: [5.0], 47.0: [9.0], 48.0: [3.0, 6.0, 15.0], 50.0: [10.0], 53.0: [7.0], 55.0: [11.0]}
var bass_dur_0 = 0.9
var bass_instrument_1 = 1
var bass_times_1 = {36: [0.0, 6.0, 8.0, 14.0], 40: [0.5, 6.5, 8.5, 14.5], 41: [2.0, 10.0], 43: [1.0, 4.0, 7.0, 9.0, 12.0, 15.0], 45: [2.5, 10.5], 47.0: [4.5, 12.5], 48.0: [1.5, 3.0, 7.5, 9.5, 11.0, 15.5], 50.0: [5.0, 13.0], 53.0: [3.5, 11.5], 55.0: [5.5, 13.5]}
var bass_dur_1 = 0.4
var bass_instrument_2 = 1
var bass_times_2 = {36: [0.0, 12.0], 40: [2.0, 14.0], 41: [4.0], 43: [3.0, 8.0, 15.0], 45: [6.0], 47.0: [10.0], 48.0: [1.0, 7.0, 13.0], 50.0: [11.0], 53.0: [5.0], 55.0: [9.0]}
var bass_dur_2 = 0.9
var bass_instrument_3 = 1
var bass_times_3 = {36: [0.0, 6.0, 8.0, 14.0], 40: [1.0, 7.0, 9.0, 15.0], 41: [2.0, 10.0], 43: [1.5, 4.0, 7.5, 9.5, 12.0, 15.5], 45: [3.0, 11.0], 47.0: [5.0, 13.0], 48.0: [0.5, 3.5, 6.5, 8.5, 11.5, 14.5], 50.0: [5.5, 13.5], 53.0: [2.5, 10.5], 55.0: [4.5, 12.5]}
var bass_dur_3 = 0.4
var bass_instrument_4 = 1
var bass_times_4 = {36: [0.0, 12.0], 40: [2.0, 14.0], 41: [4.0], 43: [1.0, 3.0, 8.0, 13.0, 15.0], 45: [6.0], 47.0: [10.0], 48.0: [5.0, 7.0], 50.0: [9.0, 11.0]}
var bass_dur_4 = 0.9
var bass_instrument_5 = 1
var bass_times_5 = {36: [0.0, 6.0, 8.0, 14.0], 40: [1.0, 7.0, 9.0, 15.0], 41: [2.0, 10.0], 43: [0.5, 1.5, 4.0, 6.5, 7.5, 8.5, 9.5, 12.0, 14.5, 15.5], 45: [3.0, 11.0], 47.0: [5.0, 13.0], 48.0: [2.5, 3.5, 10.5, 11.5], 50.0: [4.5, 5.5, 12.5, 13.5]}
var bass_dur_5 = 0.4
var bass_instrument_6 = 1
var bass_times_6 = {38: [4.0, 8.0], 41: [5.0, 9.0], 45: [0.0, 6.0, 10.0, 12.0], 48.0: [1.0, 13.0], 50.0: [7.0, 11.0], 52.0: [2.0, 14.0], 57.0: [3.0, 15.0]}
var bass_dur_6 = 0.9
var bass_instrument_7 = 1
var bass_times_7 = {38: [2.0, 4.0, 10.0, 12.0], 41: [2.5, 4.5, 10.5, 12.5], 45: [0.0, 3.0, 5.0, 6.0, 8.0, 11.0, 13.0, 14.0], 48.0: [0.5, 6.5, 8.5, 14.5], 50.0: [3.5, 5.5, 11.5, 13.5], 52.0: [1.0, 7.0, 9.0, 15.0], 57.0: [1.5, 7.5, 9.5, 15.5]}
var bass_dur_7 = 0.4
var bass_instrument_8 = 1
var bass_times_8 = {38: [4.0, 8.0], 41: [6.0, 10.0], 45: [0.0, 7.0, 11.0, 12.0], 48.0: [2.0, 14.0], 50.0: [5.0, 9.0], 52.0: [3.0, 15.0], 57.0: [1.0, 13.0]}
var bass_dur_8 = 0.9
var bass_instrument_9 = 1
var bass_times_9 = {38: [2.0, 4.0, 10.0, 12.0], 41: [3.0, 5.0, 11.0, 13.0], 45: [0.0, 3.5, 5.5, 6.0, 8.0, 11.5, 13.5, 14.0], 48.0: [1.0, 7.0, 9.0, 15.0], 50.0: [2.5, 4.5, 10.5, 12.5], 52.0: [1.5, 7.5, 9.5, 15.5], 57.0: [0.5, 6.5, 8.5, 14.5]}
var bass_dur_9 = 0.4
var bass_instrument_10 = 1
var bass_times_10 = {48.0: [2.0, 14.0], 41: [6.0, 10.0], 52.0: [1.0, 3.0, 13.0, 15.0], 45: [0.0, 5.0, 7.0, 9.0, 11.0, 12.0], 38: [4.0, 8.0]}
var bass_dur_10 = 0.9
var bass_instrument_11 = 1
var bass_times_11 = {48.0: [1.0, 7.0, 9.0, 15.0], 41: [3.0, 5.0, 11.0, 13.0], 52.0: [0.5, 1.5, 6.5, 7.5, 8.5, 9.5, 14.5, 15.5], 45: [0.0, 2.5, 3.5, 4.5, 5.5, 6.0, 8.0, 10.5, 11.5, 12.5, 13.5, 14.0], 38: [2.0, 4.0, 10.0, 12.0]}
var bass_dur_11 = 0.4
var bass_instrument_12 = 1
var bass_times_12 = {36: [0.0, 4.0, 12.0], 40: [1.0, 5.0, 13.0], 41: [8.0], 43: [2.0, 6.0, 14.0], 45: [9.0], 48.0: [3.0, 7.0, 10.0, 15.0], 53.0: [11.0]}
var bass_dur_12 = 0.9
var bass_instrument_13 = 1
var bass_times_13 = {36: [0.0, 2.0, 6.0, 8.0, 10.0, 14.0], 40: [0.5, 2.5, 6.5, 8.5, 10.5, 14.5], 41: [4.0, 12.0], 43: [1.0, 3.0, 7.0, 9.0, 11.0, 15.0], 45: [4.5, 12.5], 48.0: [1.5, 3.5, 5.0, 7.5, 9.5, 11.5, 13.0, 15.5], 53.0: [5.5, 13.5]}
var bass_dur_13 = 0.4
var bass_instrument_14 = 1
var bass_times_14 = {36: [0.0, 4.0, 12.0], 40: [2.0, 6.0, 14.0], 41: [8.0], 43: [3.0, 7.0, 15.0], 45: [10.0], 48.0: [1.0, 5.0, 11.0, 13.0], 53.0: [9.0]}
var bass_dur_14 = 0.9
var bass_instrument_15 = 1
var bass_times_15 = {36: [0.0, 2.0, 6.0, 8.0, 10.0, 14.0], 40: [1.0, 3.0, 7.0, 9.0, 11.0, 15.0], 41: [4.0, 12.0], 43: [1.5, 3.5, 7.5, 9.5, 11.5, 15.5], 45: [5.0, 13.0], 48.0: [0.5, 2.5, 5.5, 6.5, 8.5, 10.5, 13.5, 14.5], 53.0: [4.5, 12.5]}
var bass_dur_15 = 0.4
var bass_instrument_16 = 1
var bass_times_16 = {36: [0.0, 4.0, 12.0], 40: [2.0, 6.0, 14.0], 41: [8.0], 43: [1.0, 3.0, 5.0, 7.0, 13.0, 15.0], 45: [10.0], 48.0: [9.0, 11.0]}
var bass_dur_16 = 0.9
var bass_instrument_17 = 1
var bass_times_17 = {36: [0.0, 2.0, 6.0, 8.0, 10.0, 14.0], 40: [1.0, 3.0, 7.0, 9.0, 11.0, 15.0], 41: [4.0, 12.0], 43: [0.5, 1.5, 2.5, 3.5, 6.5, 7.5, 8.5, 9.5, 10.5, 11.5, 14.5, 15.5], 45: [5.0, 13.0], 48.0: [4.5, 5.5, 12.5, 13.5]}
var bass_dur_17 = 0.4
var bass_instrument_18 = 1
var bass_times_18 = {36: [0.0], 40: [1.0], 41: [12.0], 43: [2.0, 4.0], 45: [8.0, 13.0], 47.0: [5.0], 48.0: [3.0, 9.0, 14.0], 50.0: [6.0], 52.0: [10.0], 53.0: [15.0], 55.0: [7.0], 57.0: [11.0]}
var bass_dur_18 = 0.9
var bass_instrument_19 = 1
var bass_times_19 = {36: [0.0, 8.0], 40: [0.5, 8.5], 41: [6.0, 14.0], 43: [1.0, 2.0, 9.0, 10.0], 45: [4.0, 6.5, 12.0, 14.5], 47.0: [2.5, 10.5], 48.0: [1.5, 4.5, 7.0, 9.5, 12.5, 15.0], 50.0: [3.0, 11.0], 52.0: [5.0, 13.0], 53.0: [7.5, 15.5], 55.0: [3.5, 11.5], 57.0: [5.5, 13.5]}
var bass_dur_19 = 0.4
var bass_instrument_20 = 1
var bass_times_20 = {36: [0.0], 40: [2.0], 41: [12.0], 43: [3.0, 4.0], 45: [8.0, 14.0], 47.0: [6.0], 48.0: [1.0, 10.0, 15.0], 50.0: [7.0], 52.0: [11.0], 53.0: [13.0], 55.0: [5.0], 57.0: [9.0]}
var bass_dur_20 = 0.9
var bass_instrument_21 = 1
var bass_times_21 = {36: [0.0, 8.0], 40: [1.0, 9.0], 41: [6.0, 14.0], 43: [1.5, 2.0, 9.5, 10.0], 45: [4.0, 7.0, 12.0, 15.0], 47.0: [3.0, 11.0], 48.0: [0.5, 5.0, 7.5, 8.5, 13.0, 15.5], 50.0: [3.5, 11.5], 52.0: [5.5, 13.5], 53.0: [6.5, 14.5], 55.0: [2.5, 10.5], 57.0: [4.5, 12.5]}
var bass_dur_21 = 0.4
var bass_instrument_22 = 1
var bass_times_22 = {36: [0.0], 40: [2.0], 41: [12.0], 43: [1.0, 3.0, 4.0], 45: [8.0, 14.0], 47.0: [6.0], 48.0: [10.0, 13.0, 15.0], 50.0: [5.0, 7.0], 52.0: [9.0, 11.0]}
var bass_dur_22 = 0.9
var bass_instrument_23 = 1
var bass_times_23 = {36: [0.0, 8.0], 40: [1.0, 9.0], 41: [6.0, 14.0], 43: [0.5, 1.5, 2.0, 8.5, 9.5, 10.0], 45: [4.0, 7.0, 12.0, 15.0], 47.0: [3.0, 11.0], 48.0: [5.0, 6.5, 7.5, 13.0, 14.5, 15.5], 50.0: [2.5, 3.5, 10.5, 11.5], 52.0: [4.5, 5.5, 12.5, 13.5]}
var bass_dur_23 = 0.4
var bass_instrument_24 = 1
var bass_times_24 = {36: [12.0], 40: [13.0], 41: [4.0], 43: [8.0, 14.0], 45: [0.0, 5.0], 47.0: [9.0], 48.0: [1.0, 6.0, 15.0], 50.0: [10.0], 52.0: [2.0], 53.0: [7.0], 55.0: [11.0], 57.0: [3.0]}
var bass_dur_24 = 0.9
var bass_instrument_25 = 1
var bass_times_25 = {36: [6.0, 14.0], 40: [6.5, 14.5], 41: [2.0, 10.0], 43: [4.0, 7.0, 12.0, 15.0], 45: [0.0, 2.5, 8.0, 10.5], 47.0: [4.5, 12.5], 48.0: [0.5, 3.0, 7.5, 8.5, 11.0, 15.5], 50.0: [5.0, 13.0], 52.0: [1.0, 9.0], 53.0: [3.5, 11.5], 55.0: [5.5, 13.5], 57.0: [1.5, 9.5]}
var bass_dur_25 = 0.4
var bass_instrument_26 = 1
var bass_times_26 = {36: [12.0], 40: [14.0], 41: [4.0], 43: [8.0, 15.0], 45: [0.0, 6.0], 47.0: [10.0], 48.0: [2.0, 7.0, 13.0], 50.0: [11.0], 52.0: [3.0], 53.0: [5.0], 55.0: [9.0], 57.0: [1.0]}
var bass_dur_26 = 0.9
var bass_instrument_27 = 1
var bass_times_27 = {36: [6.0, 14.0], 40: [7.0, 15.0], 41: [2.0, 10.0], 43: [4.0, 7.5, 12.0, 15.5], 45: [0.0, 3.0, 8.0, 11.0], 47.0: [5.0, 13.0], 48.0: [1.0, 3.5, 6.5, 9.0, 11.5, 14.5], 50.0: [5.5, 13.5], 52.0: [1.5, 9.5], 53.0: [2.5, 10.5], 55.0: [4.5, 12.5], 57.0: [0.5, 8.5]}
var bass_dur_27 = 0.4
var bass_instrument_28 = 1
var bass_times_28 = {36: [12.0], 40: [14.0], 41: [4.0], 43: [8.0, 13.0, 15.0], 45: [0.0, 6.0], 47.0: [10.0], 48.0: [2.0, 5.0, 7.0], 50.0: [9.0, 11.0], 52.0: [1.0, 3.0]}
var bass_dur_28 = 0.9
var bass_instrument_29 = 1
var bass_times_29 = {36: [6.0, 14.0], 40: [7.0, 15.0], 41: [2.0, 10.0], 43: [4.0, 6.5, 7.5, 12.0, 14.5, 15.5], 45: [0.0, 3.0, 8.0, 11.0], 47.0: [5.0, 13.0], 48.0: [1.0, 2.5, 3.5, 9.0, 10.5, 11.5], 50.0: [4.5, 5.5, 12.5, 13.5], 52.0: [0.5, 1.5, 8.5, 9.5]}
var bass_dur_29 = 0.4

/////////////////////////////////////////////////////////
///               PERCUSSION SELECTION                ///
/////////////////////////////////////////////////////////

var percussion_instrument_0 = 118
var percussion_times_0 = {50: [0.0, 1.0, 1.5, 2.25, 2.5, 3.0, 3.5, 4.0, 5.0, 5.5, 6.25, 6.5, 7.0, 7.5, 8.0, 9.0, 9.5, 10.25, 10.5, 11.0, 11.5, 12.0, 13.0, 13.5, 14.25, 14.5, 15.0, 15.5]}
var percussion_dur_0 = 0.15
var percussion_instrument_1 = 119
var percussion_times_1 = {50: [0.0, 1.0, 1.5, 2.25, 2.5, 3.0, 3.5, 4.0, 5.0, 5.5, 6.25, 6.5, 7.0, 7.5, 8.0, 9.0, 9.5, 10.25, 10.5, 11.0, 11.5, 12.0, 13.0, 13.5, 14.25, 14.5, 15.0, 15.5]}
var percussion_dur_1 = 0.15
var percussion_instrument_2 = 120
var percussion_times_2 = {50: [0.0, 1.0, 1.5, 2.25, 2.5, 3.0, 3.5, 4.0, 5.0, 5.5, 6.25, 6.5, 7.0, 7.5, 8.0, 9.0, 9.5, 10.25, 10.5, 11.0, 11.5, 12.0, 13.0, 13.5, 14.25, 14.5, 15.0, 15.5]}
var percussion_dur_2 = 0.15
var percussion_instrument_3 = 118
var percussion_times_3 = {50: [0.0, 1.5, 2.0, 2.5, 3.5, 4.0, 5.5, 6.0, 6.5, 7.5, 8.0, 9.5, 10.0, 10.5, 11.5, 12.0, 13.5, 14.0, 14.5, 15.5]}
var percussion_dur_3 = 0.4
var percussion_instrument_4 = 119
var percussion_times_4 = {50: [0.0, 1.5, 2.0, 2.5, 3.5, 4.0, 5.5, 6.0, 6.5, 7.5, 8.0, 9.5, 10.0, 10.5, 11.5, 12.0, 13.5, 14.0, 14.5, 15.5]}
var percussion_dur_4 = 0.4
var percussion_instrument_5 = 120
var percussion_times_5 = {50: [0.0, 1.5, 2.0, 2.5, 3.5, 4.0, 5.5, 6.0, 6.5, 7.5, 8.0, 9.5, 10.0, 10.5, 11.5, 12.0, 13.5, 14.0, 14.5, 15.5]}
var percussion_dur_5 = 0.4
var percussion_instrument_6 = 118
var percussion_times_6 = {50: [0.0, 2.5, 4.0, 6.5, 8.0, 10.5, 12.0, 14.5]}
var percussion_dur_6 = 0.4
var percussion_instrument_7 = 119
var percussion_times_7 = {50: [0.0, 2.5, 4.0, 6.5, 8.0, 10.5, 12.0, 14.5]}
var percussion_dur_7 = 0.4
var percussion_instrument_8 = 120
var percussion_times_8 = {50: [0.0, 2.5, 4.0, 6.5, 8.0, 10.5, 12.0, 14.5]}
var percussion_dur_8 = 0.4
var percussion_instrument_9 = 118
var percussion_times_9 = {50: [0.0, 1.0, 2.0, 3.0, 4.0, 5.0, 6.0, 7.0, 8.0, 9.0, 10.0, 11.0, 12.0, 13.0, 14.0, 15.0]}
var percussion_dur_9 = 0.4
var percussion_instrument_10 = 119
var percussion_times_10 = {50: [0.0, 1.0, 2.0, 3.0, 4.0, 5.0, 6.0, 7.0, 8.0, 9.0, 10.0, 11.0, 12.0, 13.0, 14.0, 15.0]}
var percussion_dur_10 = 0.4
var percussion_instrument_11 = 120
var percussion_times_11 = {50: [0.0, 1.0, 2.0, 3.0, 4.0, 5.0, 6.0, 7.0, 8.0, 9.0, 10.0, 11.0, 12.0, 13.0, 14.0, 15.0]}
var percussion_dur_11 = 0.4
var percussion_instrument_12 = 118
var percussion_times_12 = {50: [0.0, 0.25, 0.5, 0.75, 1.0, 1.25, 1.5, 1.75, 2.0, 2.25, 2.5, 2.75, 3.0, 3.25, 3.5, 3.75, 4.0, 4.25, 4.5, 4.75, 5.0, 5.25, 5.5, 5.75, 6.0, 6.25, 6.5, 6.75, 7.0, 7.25, 7.5, 7.75, 8.0, 8.25, 8.5, 8.75, 9.0, 9.25, 9.5, 9.75, 10.0, 10.25, 10.5, 10.75, 11.0, 11.25, 11.5, 11.75, 12.0, 12.25, 12.5, 12.75, 13.0, 13.25, 13.5, 13.75, 14.0, 14.25, 14.5, 14.75, 15.0, 15.25, 15.5, 15.75]}
var percussion_dur_12 = 0.4
var percussion_instrument_13 = 119
var percussion_times_13 = {50: [0.0, 0.25, 0.5, 0.75, 1.0, 1.25, 1.5, 1.75, 2.0, 2.25, 2.5, 2.75, 3.0, 3.25, 3.5, 3.75, 4.0, 4.25, 4.5, 4.75, 5.0, 5.25, 5.5, 5.75, 6.0, 6.25, 6.5, 6.75, 7.0, 7.25, 7.5, 7.75, 8.0, 8.25, 8.5, 8.75, 9.0, 9.25, 9.5, 9.75, 10.0, 10.25, 10.5, 10.75, 11.0, 11.25, 11.5, 11.75, 12.0, 12.25, 12.5, 12.75, 13.0, 13.25, 13.5, 13.75, 14.0, 14.25, 14.5, 14.75, 15.0, 15.25, 15.5, 15.75]}
var percussion_dur_13 = 0.4
var percussion_instrument_14 = 120
var percussion_times_14 = {50: [0.0, 0.25, 0.5, 0.75, 1.0, 1.25, 1.5, 1.75, 2.0, 2.25, 2.5, 2.75, 3.0, 3.25, 3.5, 3.75, 4.0, 4.25, 4.5, 4.75, 5.0, 5.25, 5.5, 5.75, 6.0, 6.25, 6.5, 6.75, 7.0, 7.25, 7.5, 7.75, 8.0, 8.25, 8.5, 8.75, 9.0, 9.25, 9.5, 9.75, 10.0, 10.25, 10.5, 10.75, 11.0, 11.25, 11.5, 11.75, 12.0, 12.25, 12.5, 12.75, 13.0, 13.25, 13.5, 13.75, 14.0, 14.25, 14.5, 14.75, 15.0, 15.25, 15.5, 15.75]}
var percussion_dur_14 = 0.4
var percussion_instrument_15 = 118
var percussion_times_15 = {50: [0.0, 1.5, 2.0, 3.5, 4.0, 5.5, 6.0, 7.5, 8.0, 9.5, 10.0, 11.5, 12.0, 13.5, 14.0, 15.5]}
var percussion_dur_15 = 0.4
var percussion_instrument_16 = 119
var percussion_times_16 = {50: [0.0, 1.5, 2.0, 3.5, 4.0, 5.5, 6.0, 7.5, 8.0, 9.5, 10.0, 11.5, 12.0, 13.5, 14.0, 15.5]}
var percussion_dur_16 = 0.4
var percussion_instrument_17 = 120
var percussion_times_17 = {50: [0.0, 1.5, 2.0, 3.5, 4.0, 5.5, 6.0, 7.5, 8.0, 9.5, 10.0, 11.5, 12.0, 13.5, 14.0, 15.5]}
var percussion_dur_17 = 0.4
var percussion_instrument_18 = 118
var percussion_times_18 = {50: [0.5, 1.5, 2.5, 3.5, 4.5, 5.5, 6.5, 7.5, 8.5, 9.5, 10.5, 11.5, 12.5, 13.5, 14.5, 15.5]}
var percussion_dur_18 = 0.4
var percussion_instrument_19 = 119
var percussion_times_19 = {50: [0.5, 1.5, 2.5, 3.5, 4.5, 5.5, 6.5, 7.5, 8.5, 9.5, 10.5, 11.5, 12.5, 13.5, 14.5, 15.5]}
var percussion_dur_19 = 0.4
var percussion_instrument_20 = 120
var percussion_times_20 = {50: [0.5, 1.5, 2.5, 3.5, 4.5, 5.5, 6.5, 7.5, 8.5, 9.5, 10.5, 11.5, 12.5, 13.5, 14.5, 15.5]}
var percussion_dur_20 = 0.4

// name, instrument, notesequence, notelength
function createMusicLines(cb) {
    async.parallel([
        function(callback) {
          bassLineCreate('bass 1', bass_instrument_0, bass_times_0, bass_dur_0, callback);
        },
        function(callback) {
          bassLineCreate('bass 2', bass_instrument_1, bass_times_1, bass_dur_1, callback);
        },
        function(callback) {
          bassLineCreate('bass 3', bass_instrument_2, bass_times_2, bass_dur_2, callback);
        },
        function(callback) {
          bassLineCreate('bass 4', bass_instrument_3, bass_times_3, bass_dur_3, callback);
        },
        function(callback) {
          bassLineCreate('bass 5', bass_instrument_4, bass_times_4, bass_dur_4, callback);
        },
        function(callback) {
          bassLineCreate('bass 6', bass_instrument_5, bass_times_5, bass_dur_5, callback);
        },
        function(callback) {
          bassLineCreate('bass 7', bass_instrument_6, bass_times_6, bass_dur_6, callback);
        },
        function(callback) {
          bassLineCreate('bass 8', bass_instrument_7, bass_times_7, bass_dur_7, callback);
        },
        function(callback) {
          bassLineCreate('bass 9', bass_instrument_8, bass_times_8, bass_dur_8, callback);
        },
        function(callback) {
          bassLineCreate('bass 10', bass_instrument_9, bass_times_9, bass_dur_9, callback);
        },
        function(callback) {
          bassLineCreate('bass 11', bass_instrument_10, bass_times_10, bass_dur_10, callback);
        },
        function(callback) {
          bassLineCreate('bass 12', bass_instrument_11, bass_times_11, bass_dur_11, callback);
        },
        function(callback) {
          bassLineCreate('bass 13', bass_instrument_12, bass_times_12, bass_dur_12, callback);
        },
        function(callback) {
          bassLineCreate('bass 14', bass_instrument_13, bass_times_13, bass_dur_13, callback);
        },
        function(callback) {
          bassLineCreate('bass 15', bass_instrument_14, bass_times_14, bass_dur_14, callback);
        },
        function(callback) {
          bassLineCreate('bass 16', bass_instrument_15, bass_times_15, bass_dur_15, callback);
        },
        function(callback) {
          bassLineCreate('bass 17', bass_instrument_16, bass_times_16, bass_dur_16, callback);
        },
        function(callback) {
          bassLineCreate('bass 18', bass_instrument_17, bass_times_17, bass_dur_17, callback);
        },
        function(callback) {
          bassLineCreate('bass 19', bass_instrument_18, bass_times_18, bass_dur_18, callback);
        },
        function(callback) {
          bassLineCreate('bass 20', bass_instrument_19, bass_times_19, bass_dur_19, callback);
        },
        function(callback) {
          bassLineCreate('bass 21', bass_instrument_20, bass_times_20, bass_dur_20, callback);
        },
        function(callback) {
          bassLineCreate('bass 22', bass_instrument_21, bass_times_21, bass_dur_21, callback);
        },
        function(callback) {
          bassLineCreate('bass 23', bass_instrument_22, bass_times_22, bass_dur_22, callback);
        },
        function(callback) {
          bassLineCreate('bass 24', bass_instrument_23, bass_times_23, bass_dur_23, callback);
        },
        function(callback) {
          bassLineCreate('bass 25', bass_instrument_24, bass_times_24, bass_dur_24, callback);
        },
        function(callback) {
          bassLineCreate('bass 26', bass_instrument_25, bass_times_25, bass_dur_25, callback);
        },
        function(callback) {
          bassLineCreate('bass 27', bass_instrument_26, bass_times_26, bass_dur_26, callback);
        },
        function(callback) {
          bassLineCreate('bass 28', bass_instrument_27, bass_times_27, bass_dur_27, callback);
        },
        function(callback) {
          bassLineCreate('bass 29', bass_instrument_28, bass_times_28, bass_dur_28, callback);
        },
        function(callback) {
          bassLineCreate('bass 30', bass_instrument_29, bass_times_29, bass_dur_29, callback);
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
          melodyLineCreate('melody 7', melody_instrument_6, melody_times_6, melody_dur_6, callback);
        },
        function(callback) {
          melodyLineCreate('melody 8', melody_instrument_7, melody_times_7, melody_dur_7, callback);
        },
        function(callback) {
          melodyLineCreate('melody 9', melody_instrument_8, melody_times_8, melody_dur_8, callback);
        },
        function(callback) {
          melodyLineCreate('melody 10', melody_instrument_9, melody_times_9, melody_dur_9, callback);
        },
        function(callback) {
          melodyLineCreate('melody 11', melody_instrument_10, melody_times_10, melody_dur_10, callback);
        },
        function(callback) {
          melodyLineCreate('melody 12', melody_instrument_11, melody_times_11, melody_dur_11, callback);
        },
        function(callback) {
          melodyLineCreate('melody 13', melody_instrument_12, melody_times_12, melody_dur_12, callback);
        },
        function(callback) {
          melodyLineCreate('melody 14', melody_instrument_13, melody_times_13, melody_dur_13, callback);
        },
        function(callback) {
          percussionLineCreate('percussion 1', percussion_instrument_0, percussion_times_0, percussion_dur_0, callback);
        },
        function(callback) {
          percussionLineCreate('percussion 2', percussion_instrument_1, percussion_times_1, percussion_dur_1, callback);
        },
        function(callback) {
          percussionLineCreate('percussion 3', percussion_instrument_2, percussion_times_2, percussion_dur_2, callback);
        },
        function(callback) {
          percussionLineCreate('percussion 4', percussion_instrument_3, percussion_times_3, percussion_dur_3, callback);
        },
        function(callback) {
          percussionLineCreate('percussion 5', percussion_instrument_4, percussion_times_4, percussion_dur_4, callback);
        },
        function(callback) {
          percussionLineCreate('percussion 6', percussion_instrument_5, percussion_times_5, percussion_dur_5, callback);
        },
        function(callback) {
          percussionLineCreate('percussion 7', percussion_instrument_6, percussion_times_6, percussion_dur_6, callback);
        },
        function(callback) {
          percussionLineCreate('percussion 8', percussion_instrument_7, percussion_times_7, percussion_dur_7, callback);
        },
        function(callback) {
          percussionLineCreate('percussion 9', percussion_instrument_8, percussion_times_8, percussion_dur_8, callback);
        },
        function(callback) {
          percussionLineCreate('percussion 10', percussion_instrument_9, percussion_times_9, percussion_dur_9, callback);
        },
        function(callback) {
          percussionLineCreate('percussion 11', percussion_instrument_10, percussion_times_10, percussion_dur_10, callback);
        },
        function(callback) {
          percussionLineCreate('percussion 12', percussion_instrument_11, percussion_times_11, percussion_dur_11, callback);
        },
        function(callback) {
          percussionLineCreate('percussion 13', percussion_instrument_12, percussion_times_12, percussion_dur_12, callback);
        },
        function(callback) {
          percussionLineCreate('percussion 14', percussion_instrument_13, percussion_times_13, percussion_dur_13, callback);
        },
        function(callback) {
          percussionLineCreate('percussion 15', percussion_instrument_14, percussion_times_14, percussion_dur_14, callback);
        },
        function(callback) {
          percussionLineCreate('percussion 16', percussion_instrument_15, percussion_times_15, percussion_dur_15, callback);
        },
        function(callback) {
          percussionLineCreate('percussion 17', percussion_instrument_16, percussion_times_16, percussion_dur_16, callback);
        },
        function(callback) {
          percussionLineCreate('percussion 18', percussion_instrument_17, percussion_times_17, percussion_dur_17, callback);
        },
        function(callback) {
          percussionLineCreate('percussion 19', percussion_instrument_18, percussion_times_18, percussion_dur_18, callback);
        },
        function(callback) {
          percussionLineCreate('percussion 20', percussion_instrument_19, percussion_times_19, percussion_dur_19, callback);
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

function getRandomLines(lineInventory) {
  var numToSelect = Math.min(lineInventory.length, 3);
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

function createSubmissions(cb) {
    async.series([
        function(callback) {
          submissionCreate(players[0], [melody_lines[0], melody_lines[1], melody_lines[3]], [bass_lines[1], bass_lines[2], bass_lines[4]], [percussion_lines[0], percussion_lines[1], percussion_lines[2]], melody_lines[0], bass_lines[2], percussion_lines[0], 120, true, callback);
        },
        function(callback) {
          submissionCreate(players[0], getRandomLines(melody_lines), getRandomLines(bass_lines), getRandomLines(percussion_lines), false, false, false, false, false, callback);
        },
        function(callback) {
          submissionCreate(players[1], [melody_lines[2], melody_lines[3], melody_lines[5]], [bass_lines[4], bass_lines[3], bass_lines[2]], [percussion_lines[0], percussion_lines[3], percussion_lines[6]], melody_lines[3], bass_lines[4], percussion_lines[0], true, 120, callback);
        },
        function(callback) {
          submissionCreate(players[1], getRandomLines(melody_lines), getRandomLines(bass_lines), getRandomLines(percussion_lines), false, false, false, false, false, callback);
        },
        function(callback) {
          submissionCreate(players[2], [melody_lines[4], melody_lines[3], melody_lines[2]], [bass_lines[1], bass_lines[2], bass_lines[4]], [percussion_lines[1], percussion_lines[2], percussion_lines[4]], melody_lines[3], bass_lines[4], percussion_lines[0], true, 120, callback);
        },
        function(callback) {
          submissionCreate(players[2], getRandomLines(melody_lines), getRandomLines(bass_lines), getRandomLines(percussion_lines), false, false, false, false, false, callback);
        },
        function(callback) {
          submissionCreate(players[3], [melody_lines[0], melody_lines[1], melody_lines[3]], [bass_lines[1], bass_lines[2], bass_lines[4]], [percussion_lines[0], percussion_lines[1], percussion_lines[2]], melody_lines[1], bass_lines[1], percussion_lines[0], true, 120, callback);
        },
        function(callback) {
          submissionCreate(players[3], getRandomLines(melody_lines), getRandomLines(bass_lines), getRandomLines(percussion_lines), false, false, false, false, false, callback);
        },
        function(callback) {
          submissionCreate(players[4], getRandomLines(melody_lines), getRandomLines(bass_lines), getRandomLines(percussion_lines), false, false, false, false, false, callback);
        },
        function(callback) {
          submissionCreate(players[5], [melody_lines[2], melody_lines[3], melody_lines[5]], [bass_lines[4], bass_lines[3], bass_lines[2]], [percussion_lines[0], percussion_lines[3], percussion_lines[6]], melody_lines[3], bass_lines[4], percussion_lines[0], true, 60, callback);
        },
        function(callback) {
          submissionCreate(players[6], [melody_lines[4], melody_lines[3], melody_lines[2]], [bass_lines[1], bass_lines[2], bass_lines[4]], [percussion_lines[1], percussion_lines[2], percussion_lines[4]], melody_lines[3], bass_lines[4], percussion_lines[1], true, 120, callback);
        },
        function(callback) {
          submissionCreate(players[7], [melody_lines[0], melody_lines[1], melody_lines[3]], [bass_lines[1], bass_lines[2], bass_lines[4]], [percussion_lines[0], percussion_lines[1], percussion_lines[2]], melody_lines[1], bass_lines[1], percussion_lines[2], true, 200, callback);
        },
      ], cb);
}


function createRounds(cb) {
    async.series([
        function(callback) {
          roundCreate(1, 'GV9-R7WOM-o', [submissions[0], submissions[2], submissions[4], submissions[6]], submissions[4], players[0], callback);
        },
        function(callback) {
          roundCreate(2, 'AbeABOfx82Q', [submissions[1], submissions[3], submissions[5], submissions[7]], false, players[1], callback);
        },
        function(callback) {
          roundCreate(1, 'GV9-R7WOM-o', [submissions[8], submissions[9], submissions[10], submissions[11]], false, players[4], callback);
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
