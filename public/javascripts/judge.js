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

var channelOn = [null, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false];

/////////////////////////////////////////////////////////
///                 AUDIO SCHEDULER                   ///
/////////////////////////////////////////////////////////

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
            ditty.set([channel, note_id], events, 32)
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

  var onNotes = new Set(); // not sure if this is needed

  function noteOn(time, id){
    var [channel, note_id] = id
    MIDI.noteOn(channel, note_id, channelOn[channel] ? 127 : 0, time)
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

  scheduler.setTempo(120)
  setTimeout(function(){
    scheduler.start();
    alert('done loading');
  }, 3000)
}

/////////////////////////////////////////////////////////
///                    GAME LOGIC                     ///
/////////////////////////////////////////////////////////

function selectNone() {
  console.log('None selected');
  channelOn = [null, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false];
}

function selectOption(optionNumber) {
  if (optionNumber < 1 || optionNumber > 3) {
    console.log('Option Number', optionNumber, 'is invalid.');
  }

  console.log('Option ' + optionNumber + ' selected.');
  selectNone();
  for(var i = 0; i < 3; i++) {
    var channel = baseChannel[optionNumber] + i;
    channelOn[channel] = true;
  }
  console.log(channelOn);
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

window.onload = function () {
  // load MIDI plugin
  MIDI.loadPlugin({
    soundfontUrl: "/javascripts/midi/soundfont/",
    instrument: [
      "acoustic_grand_piano",
      "synth_drum",
      "alto_sax",
      "acoustic_guitar_nylon",
      "acoustic_guitar_steel",
      "baritone_sax",
      "brass_section",
      "electric_bass_pick",
      "electric_guitar_jazz",
      "trumpet",
      "flute",
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
