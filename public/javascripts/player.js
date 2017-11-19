// player.js

const NUM_STATES = 3;

var melodyIndex = 0;

function nextMelody() {
  $.get('/gameplay/player/' + playerId, function(data) {
    alert("Data: " + data);
  });

  $('#melody-button').text(melodyIndex);
  melodyIndex = (melodyIndex + 1) % NUM_STATES;

  var delay = 0; // play one note every quarter second
  var note = 50; // the MIDI note
  var velocity = 127; // how hard the note hits

  // set instrument for channel 1
  MIDI.programChange(0, 0);

  // play the note
  MIDI.setVolume(0, 127);
  MIDI.noteOn(0, note, velocity, delay);
  MIDI.noteOff(0, note, delay + 0.75);
}

function nextPercussion() {
  var delay = 0; // play one note every quarter second
  var note = 50; // the MIDI note
  var velocity = 127; // how hard the note hits

  // set instrument for channel 1
  MIDI.programChange(1, 118);

  // play the note
  MIDI.setVolume(1, 127);
  MIDI.noteOn(1, note, velocity, delay);
  MIDI.noteOff(1, note, delay + 0.75);
}

function nextBass() {
  var delay = 0; // play one note every quarter second
  var note = 50; // the MIDI note
  var velocity = 127; // how hard the note hits

  // set instrument for channel 1
  MIDI.programChange(2, 65);

  // play the note
  MIDI.setVolume(2, 127);
  MIDI.noteOn(2, note, velocity, delay);
  MIDI.noteOff(2, note, delay + 0.75);
}

function onMidiLoaded() {
  // alert("Let's begin!");

  // set up button click handlers
  $('#melody-button').click(function(event) {
    nextMelody();
  });

  $('#percussion-button').click(function(event) {
    nextPercussion();
  });

  $('#bass-button').click(function(event) {
    nextBass();
  })
}

window.onload = function () {
  // load MIDI plugin
  MIDI.loadPlugin({
    soundfontUrl: "/javascripts/midi/soundfont/",
    instrument: [ "acoustic_grand_piano", "synth_drum", "alto_sax" ],
    onprogress: function(state, progress) {
      console.log(state, progress);
    },
    onsuccess: onMidiLoaded
  });
};
