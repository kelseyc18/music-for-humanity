// player.js

var Ditty = require('ditty');
var ditty = Ditty();
var Bopper = require('bopper');

/////////////////////////////////////////////////////////
///               MUSIC LINE SELECTION                ///
/////////////////////////////////////////////////////////

const NUM_MELODY_STATES = Math.min(melodyLines.length + 1, 4);
const NUM_BASS_STATES = Math.min(bassLines.length + 1, 4);
const NUM_PERCUSSION_STATES = Math.min(percussionLines.length + 1, 4);

const MELODY = 0;
const PERCUSSION = 1;
const BASS = 2;

var offsets = {
  'melody': 0,
  'percussion': 0,
  'bass': 0
}

var baseChannel = {
  'melody': 1, // 1 to 4
  'percussion': 5, // 5 to 8
  'bass': 11 // 11 to 14
}

var channelOn = [null, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false];

console.log(melodyLines);
console.log(bassLines);
console.log(percussionLines);

function getChannelNumber(lineType, offset) {
  switch(lineType) {
    case MELODY:
      return baseChannel['melody'] + offset;
    case PERCUSSION:
      return baseChannel['percussion'] + offset;
    case BASS:
      return baseChannel['bass'] + offset;
  }
}

function updateMelodyButton() {
  melodyIndex = offsets['melody']
  if (melodyIndex == 0) {
    $('#melody-button').text('No Melody Selected');
    return;
  }
  $('#melody-button').text(melodyLines[melodyIndex-1].name);
}

function updatePercussionButton() {
  percussionIndex = offsets['percussion']
  if (percussionIndex == 0) {
    $('#percussion-button').text('No Percussion Selected');
    return;
  }
  $('#percussion-button').text(percussionLines[percussionIndex-1].name);
}

function updateBassButton() {
  bassIndex = offsets['bass']
  if (bassIndex == 0) {
    $('#bass-button').text('No Bass Selected');
    return;
  }
  $('#bass-button').text(bassLines[bassIndex-1].name);
}

function nextMelody() {
  melodyIndex = offsets['melody']
  offsets['melody'] = (melodyIndex + 1) % NUM_MELODY_STATES;

  for(i = 0; i < 4; i++) {
    if(i == offsets['melody']) {
      channelOn[getChannelNumber(MELODY, i)] = true;
    } else {
      channelOn[getChannelNumber(MELODY, i)] = false;
    }
  }
  updateMelodyButton();
}

function nextPercussion() {
  percussionIndex = offsets['percussion']
  offsets['percussion'] = (percussionIndex + 1) % NUM_PERCUSSION_STATES;

  for(i = 0; i < 4; i++) {
    if(i == offsets['percussion']) {
      channelOn[getChannelNumber(PERCUSSION, i)] = true;
    } else {
      channelOn[getChannelNumber(PERCUSSION, i)] = false;
    }
  }
  updatePercussionButton();
}

function nextBass() {
  bassIndex = offsets['bass']
  offsets['bass'] = (bassIndex + 1) % NUM_BASS_STATES;

  for(i = 0; i < 4; i++) {
    if(i == offsets['bass']) {
      channelOn[getChannelNumber(BASS, i)] = true;
    } else {
      channelOn[getChannelNumber(BASS, i)] = false;
    }
  }
  updateBassButton();
}

/////////////////////////////////////////////////////////
///                     ANIMATION                     ///
/////////////////////////////////////////////////////////

function animateSnail() {
  let start = Date.now();

  let timer = setInterval(function() {
    let timePassed = Date.now() - start;

    snail.style.left = timePassed / 50 + 'px';

    if (timePassed / 50 > 520) {
      snail.style.left = '0px';
      start = Date.now();
    }

  }, 20);
}

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

  melodyLines.forEach(function(line, index) {
    if(index < 3) {
      var offset = index + 1;
      var sequence = line.notesequence;
      var channel = getChannelNumber(MELODY, offset);

      for (var note_id in sequence) {
        var val = sequence[note_id]
        var events = val.map(time => [time, line.notelength])
        ditty.set([channel, note_id], events, 16)
      }

      MIDI.programChange(channel, line.instrument);
    }
  });

  bassLines.forEach(function(line, index) {
    if(index < 3) {
      var offset = index + 1;
      var sequence = line.notesequence;
      var channel = getChannelNumber(BASS, offset);

      for (var note_id in sequence) {
        var val = sequence[note_id]
        var events = val.map(time => [time, line.notelength])
        ditty.set([channel, note_id], events, 16)
      }

      MIDI.programChange(channel, line.instrument);
    }
  });

  percussionLines.forEach(function(line, index) {
    if(index < 3) {
      var offset = index + 1;
      var sequence = line.notesequence;
      var channel = getChannelNumber(PERCUSSION, offset);

      for (var note_id in sequence) {
        var val = sequence[note_id]
        var events = val.map(time => [time, line.notelength])
        ditty.set([channel, note_id], events, 16)
      }

      MIDI.programChange(channel, line.instrument);
    }
  });

  //////////////////////////////

  // mixer
  var output = audioContext.createGain()
  output.gain.value = 0.5
  output.connect(audioContext.destination)

  var onNotes = new Set(); // not sure if this is needed

  function noteOn(time, id){
    var [channel, note_id] = id
    MIDI.noteOn(channel, note_id, channelOn[channel] ? 127 : 0, time)
    console.log('noteOn');
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
    enableButtonsAsNeeded();
    // if(roundNumber == 2) animateSnail();
  }, 3000)
}

/////////////////////////////////////////////////////////
///                    GAME LOGIC                     ///
/////////////////////////////////////////////////////////

function publishSubmission() {
  var data = {
    submissionId: submissionId,
    selectedMelodyId: melodyIndex ? melodyLines[melodyIndex-1].id : null,
    selectedBassId: bassIndex ? bassLines[bassIndex-1].id : null,
    selectedPercussionId: percussionIndex ? percussionLines[percussionIndex-1].id : null,
    playerId: playerId,
    isSubmitted: true
  };

  $.post('/gameplay/submission/update', data, function(res) {
    console.log(res);
    location.reload(true);
  });
}

function enableButtonsAsNeeded() {
  $('#melody-button').prop('disabled', false);
  $('#bass-button').prop('disabled', false);
  $('#percussion-button').prop('disabled', false);

  if(!isSubmitted) {
    $('#publish-submission-btn').prop('disabled', false);
  }
}

function onMidiLoaded() {
  initializeScheduler();

  // set up button click handlers
  $('#melody-button').click(function(event) {
    nextMelody();
  });

  $('#percussion-button').click(function(event) {
    nextPercussion();
  });

  $('#bass-button').click(function(event) {
    nextBass();
  });

  $('#publish-submission-btn').click(function(event) {
    publishSubmission();
    $('#publish-submission-btn').prop('disabled', true);
  })
}

window.onload = function () {
  $('#melody-button').prop('disabled', true);
  $('#bass-button').prop('disabled', true);
  $('#percussion-button').prop('disabled', true);
  $('#publish-submission-btn').prop('disabled', true);

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
};
