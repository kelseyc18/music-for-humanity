// player.js

const NUM_MELODY_STATES = melodyLines.length + 1;
const NUM_BASS_STATES = bassLines.length + 1;
const NUM_PERCUSSION_STATES = percussionLines.length + 1;

var melodyIndex = 0;
var bassIndex = 0;
var percussionIndex = 0;

console.dir(melodyLines);
console.dir(bassLines);
console.dir(percussionLines);

function updateMelodyButton() {
  if (melodyIndex == 0) {
    $('#melody-button').text('No Melody Selected');
    return;
  }
  $('#melody-button').text(melodyLines[melodyIndex-1].name);
}

function updateBassButton() {
  if (bassIndex == 0) {
    $('#bass-button').text('No Bass Selected');
    return;
  }
  $('#bass-button').text(bassLines[bassIndex-1].name);
}

function updatePercussionButton() {
  if (percussionIndex == 0) {
    $('#percussion-button').text('No Percussion Selected');
    return;
  }
  $('#percussion-button').text(percussionLines[percussionIndex-1].name);
}

function nextMelody() {
  melodyIndex = (melodyIndex + 1) % NUM_MELODY_STATES;
  updateMelodyButton();

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
  percussionIndex = (percussionIndex + 1) % NUM_PERCUSSION_STATES;
  updatePercussionButton();

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
  bassIndex = (bassIndex + 1) % NUM_BASS_STATES;
  updateBassButton();

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
  });

  if(roundNumber == 2) animateSnail();
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
