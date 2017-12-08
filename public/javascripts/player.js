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
    $('#melody-text').text('No Melody Selected');
    document.getElementById('melody-button').style.backgroundImage = "url('/images/none.png')";
    return;
  }
  $('#melody-text').text(melodyLines[melodyIndex-1].name);
  // document.getElementById('melody-button').style.backgroundImage = "url('/images/" + melodyLines[melodyIndex-1].image + "')";
}

function updatePercussionButton() {
  percussionIndex = offsets['percussion']
  if (percussionIndex == 0) {
    $('#percussion-text').text('No Percussion Selected');
    document.getElementById('percussion-button').style.backgroundImage = "url('/images/none.png')";
    return;
  }
  $('#percussion-text').text(percussionLines[percussionIndex-1].name);
  // document.getElementById('percussion-button').style.backgroundImage = "url('/images/" + percussionLines[percussionIndex-1].image + "')";
}

function updateBassButton() {
  bassIndex = offsets['bass']
  if (bassIndex == 0) {
    $('#bass-text').text('No Bass Selected');
    document.getElementById('bass-button').style.backgroundImage = "url('/images/none.png')";
    return;
  }
  $('#bass-text').text(bassLines[bassIndex-1].name);
  // document.getElementById('bass-button').style.backgroundImage = "url('/images/" + bassLines[bassIndex-1].image + "')";
}

function nextMelody() {
  melodyIndex = offsets['melody']
  offsets['melody'] = (melodyIndex + 1) % NUM_MELODY_STATES;

  for(i = 0; i < 4; i++) {
    if(i == offsets['melody']) {
      console.log('channel %d on', getChannelNumber(MELODY, i));
      MIDI.setVolume(getChannelNumber(MELODY, i), 127);
    } else {
      console.log('channel %d off', getChannelNumber(MELODY, i));
      MIDI.setVolume(getChannelNumber(MELODY, i), 0);
    }
  }
  updateMelodyButton();
}

function nextPercussion() {
  percussionIndex = offsets['percussion']
  offsets['percussion'] = (percussionIndex + 1) % NUM_PERCUSSION_STATES;

  for(i = 0; i < 4; i++) {
    if(i == offsets['percussion']) {
      console.log('channel %d on', getChannelNumber(PERCUSSION, i));
      MIDI.setVolume(getChannelNumber(PERCUSSION, i), 127);
    } else {
      console.log('channel %d on', getChannelNumber(PERCUSSION, i));
      MIDI.setVolume(getChannelNumber(PERCUSSION, i), 0);
    }
  }
  updatePercussionButton();
}

function nextBass() {
  bassIndex = offsets['bass']
  offsets['bass'] = (bassIndex + 1) % NUM_BASS_STATES;

  for(i = 0; i < 4; i++) {
    if(i == offsets['bass']) {
      console.log('channel %d on', getChannelNumber(BASS, i));
      MIDI.setVolume(getChannelNumber(BASS, i), 127);
    } else {
      console.log('channel %d on', getChannelNumber(BASS, i));
      MIDI.setVolume(getChannelNumber(BASS, i), 0);
    }
  }
  updateBassButton();
}

/////////////////////////////////////////////////////////
///                 AUDIO SCHEDULER                   ///
/////////////////////////////////////////////////////////

function getInstrumentsToLoad(musicLines) {
  return Array.from(new Set(musicLines.map(line => instrument_name_list[line.instrument])));
}

function addLinesToDitty() {
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
      MIDI.setVolume(channel, 0);
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
      MIDI.setVolume(channel, 0);
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
        console.log(channel, note_id);
        ditty.set([channel, note_id], events, 16)
      }

      MIDI.programChange(channel, line.instrument);
      MIDI.setVolume(channel, 0);
    }
  });
}

var onNotes = new Set(); // not sure if this is needed

function noteOn(time, id){
  var [channel, note_id] = id
  MIDI.noteOn(channel, note_id, 127, time)
  // console.log('noteOn');
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

  addLinesToDitty();

  //////////////////////////////

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
  console.log('playerOnVideoRestart');
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
    isSubmitted: true,
    tempo: document.getElementById('tempo-slider').value
  };

  $.post('/gameplay/submission/update', data, function(res) {
    console.log(res);
    location.reload(true);
  });
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
  });

  document.getElementById('tempo-slider').onchange = function() {
    scheduler.setTempo(this.value);
    window.playerOnVideoRestart();
  }

  document.getElementById('melody-button').style.backgroundImage = "url('/images/none.png')";
  document.getElementById('percussion-button').style.backgroundImage = "url('/images/none.png')";
  document.getElementById('bass-button').style.backgroundImage = "url('/images/none.png')";
}

$(function() {
  $('.content').css('visibility', 'hidden');
  $('#loading').show();
});

window.onload = function () {
  instruments_to_load = getInstrumentsToLoad(melodyLines.concat(percussionLines, bassLines));
  console.log('loading instruments ', instruments_to_load);

  // load MIDI plugin
  MIDI.loadPlugin({
    soundfontUrl: "http://www.song-data.com/3rd/MIDIjs/soundfont/",
    instrument: instruments_to_load,
    onprogress: function(state, progress) {
      console.log(state, progress);
    },
    onsuccess: onMidiLoaded
  });
};
