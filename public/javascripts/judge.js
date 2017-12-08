// judge.js

var Ditty = require('ditty');
var ditty = Ditty();
var Bopper = require('bopper');

// option 0
// all channels muted

// option 1
// channels 1, 2, 3 unmuted

// option 2
// channels 4, 5, 6 unmuted

// option 3
// channels 7, 8, 9 unmuted

var optionNumberToPlayerId = {};
var optionNumberToSubmissionId = {};
var baseChannel = [null, 1, 4, 7]

/////////////////////////////////////////////////////////
///                 AUDIO SCHEDULER                   ///
/////////////////////////////////////////////////////////

var onNotes = new Set(); // not sure if this is needed

function noteOn(time, id){
  var [channel, note_id] = id
  MIDI.noteOn(channel, note_id, 127, time)
  onNotes.add(id);
}

function noteOff(time, id){
  if (onNotes.has(id)){
    var [channel, note_id] = id
    // console.log('[off] time', time, 'channel', channel, 'note_id', note_id)
    MIDI.noteOff(channel, note_id, time)
    onNotes.delete(id)
  }
}

function initializeScheduler() {
  var audioContext = MIDI.getContext();
  var scheduler = Bopper(audioContext);

  // prevent scheduler from being garbage collected
  window.scheduler = scheduler

  scheduler.pipe(ditty).on('data', function(data){
    // data: id, event (start or stop), time, position, args
    if (data.event == 'start'){
      noteOn(data.time, data.id, data.args)
    } else if (data.event == 'stop'){
      noteOff(data.time, data.id, data.args)
    }
  });

  // // ditty set format:
  // ([channel, note_id], [
  //   [beatPosition, length],
  //   [beatPosition, length],
  //    ...
  //   ], loop_length)

  linesFromSubmissions.forEach(function(submission, submissionIndex) {
    if(submissionIndex < 3) {
      optionNumberToPlayerId[(submissionIndex + 1).toString()] = submission.playerId;
      optionNumberToSubmissionId[(submissionIndex + 1).toString()] = submission.submissionId;
      var lines = submission.lines;

      lines.forEach(function(line, index) {
        if (index < 3) {
          var sequence = line.notesequence;
          var channel = baseChannel[submissionIndex + 1] + index;

          for (var note_id in sequence) {
            var val = sequence[note_id]
            var events = val.map(time => [time, line.notelength])
            ditty.set([channel, note_id], events, 16)
          }

          console.log('channel number', channel);
          MIDI.programChange(channel, line.instrument);
        }
      });
    }
  });


  // mixer
  var output = audioContext.createGain()
  output.gain.value = 0.5
  output.connect(audioContext.destination)

  scheduler.setTempo(120)
  setTimeout(function(){
    scheduler.start();
    $('#loading').hide();
    $('.content').css('visibility', 'visible');
  }, 500)
}

/////////////////////////////////////////////////////////
///                   VIDEO PLAYER                    ///
/////////////////////////////////////////////////////////

window.playerOnVideoRestart = function() {
  onNotes.forEach(function callback([channel, note_id]) {
    MIDI.noteOff(channel, note_id, 0);
  });
  onNotes.clear()

  player.seekTo(0);
  player.playVideo();
  scheduler.setPosition(0);
  console.log('judge::playerOnVideoRestart');
}

/////////////////////////////////////////////////////////
///                    GAME LOGIC                     ///
/////////////////////////////////////////////////////////

function selectNone() {
  console.log('None selected');
  for(var i = 1; i <= 16; i++) {
    MIDI.setVolume(i, 0);
  }
}

function selectOption(optionNumber) {
  if (optionNumber < 1 || optionNumber > 3) {
    console.log('Option Number', optionNumber, 'is invalid.');
  }

  console.log('Option ' + optionNumber + ' selected.');
  selectNone();
  for(var i = 0; i < 3; i++) {
    var channel = baseChannel[optionNumber] + i;
    MIDI.setVolume(channel, 127);
  }
  window.playerOnVideoRestart();
}

function optionNameToNumber(optionName) {
  return parseInt(optionName.substring('option'.length));
}

function selectWinner() {
  var selectedOptionNumber = optionNameToNumber($('#winner-selection input:radio:checked').val());
  var data = {
    submissionId: optionNumberToSubmissionId[selectedOptionNumber],
    roundId: roundId,
  };

  $.post('/gameplay/round/select_winner', data, function(res) {
    console.log(res);
    location.reload(true);
  });
}

function onMidiLoaded() {
  selectNone();
  initializeScheduler();

  // set up button click handlers
  $('#option0-btn').click(function(event) {
    selectNone();
  });

  $('#option1-btn').click(function(event) {
    selectOption(1);
  });

  $('#option2-btn').click(function(event) {
    selectOption(2);
  });

  $('#option3-btn').click(function(event) {
    selectOption(3);
  });
}

$(function() {
  $('.content').css('visibility', 'hidden');
  $('#loading').show();
});

window.onload = function () {
  // load MIDI plugin
  MIDI.loadPlugin({
    soundfontUrl: "http://www.song-data.com/3rd/MIDIjs/soundfont/",
    instrument: [
      "synth_drum", // 118
      "reverse_cymbal", // 119
      "guitar_fret_noise", // 120
      "bright_acoustic_piano", // 1
      "trombone", // 57
      "viola", // 41
      "contrabass", // 43
      "harpsichord", // 6
    ],
    onprogress: function(state, progress) {
      console.log(state, progress);
    },
    onsuccess: onMidiLoaded
  });

  $('#select-winner-btn').click(function(event) {
    selectWinner();
  });
}
