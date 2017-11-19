// player.js

var Ditty = require('ditty');
var ditty = Ditty();
var Bopper = require('bopper');

/////////////////////////////////////////////////////////
///               MUSIC LINE SELECTION                ///
/////////////////////////////////////////////////////////

const NUM_MELODY_STATES = melodyLines.length + 1;
const NUM_BASS_STATES = bassLines.length + 1;
const NUM_PERCUSSION_STATES = percussionLines.length + 1;

var indices = {
  0: 0, // melodyIndex
  1: 0, // bassIndex
  2: 0 // percussionIndex
}

console.dir(melodyLines);
console.dir(bassLines);
console.dir(percussionLines);

function updateMelodyButton() {
  melodyIndex = indices[0]
  if (melodyIndex == 0) {
    $('#melody-button').text('No Melody Selected');
    return;
  }
  $('#melody-button').text(melodyLines[melodyIndex-1].name);
}

function updatePercussionButton() {
  percussionIndex = indices[1]
  if (percussionIndex == 0) {
    $('#percussion-button').text('No Percussion Selected');
    return;
  }
  $('#percussion-button').text(percussionLines[percussionIndex-1].name);
}

function updateBassButton() {
  bassIndex = indices[2]
  if (bassIndex == 0) {
    $('#bass-button').text('No Bass Selected');
    return;
  }
  $('#bass-button').text(bassLines[bassIndex-1].name);
}

function nextMelody() {
  melodyIndex = indices[0]
  indices[0] = (melodyIndex + 1) % NUM_MELODY_STATES;
  updateMelodyButton();
}

function nextPercussion() {
  percussionIndex = indices[1]
  indices[1] = (percussionIndex + 1) % NUM_PERCUSSION_STATES;
  updatePercussionButton();
}

function nextBass() {
  bassIndex = indices[2]
  indices[2] = (bassIndex + 1) % NUM_BASS_STATES;
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

  // ([channel, note_id], [
  //   [beatPosition, length], 
  //   [beatPosition, length],
  //    ...
  //   ], loop_length)

  // melody line
  // [[[81,0,78,79,81,0,78,79]],[[81,69,71,73,74,76,78,79]],
  // [[78,0,74,76,78,0,66,67]],[[69,71,69,67,69,66,67,69]], 
  // [[67,0,71,69,67,0,66,64]],[[66,64,62,64,66,67,69,71]], 
  // [[67,0,71,69,71,0,73,74]],[[69,71,73,74,76,78,79,81]]]

  // bass line
  // [[50,54,57,62], [45,49,52,57], [47,50,54,59], [42,45,49,54],
  // [43,47,50,55], [38,42,45,50], [43,47,50,55], [45,49,52,57]]

  var melody_times = {0: [0.5, 2.5, 8.5, 10.5, 16.5, 18.5, 24.5, 26.5],
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

  var bass_times = {38: [20.0],
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


  for (var note_id in melody_times) {
    var val = melody_times[note_id]
    var events = val.map(time => [time, 0.4])
    ditty.set([0, note_id], events, 32)
  }

  for (var note_id in bass_times) {
    var val = bass_times[note_id]
    var events = val.map(time => [time, 0.8])
    ditty.set([2, note_id], events, 32)
  }

  // mixer
  var output = audioContext.createGain()
  output.gain.value = 0.5
  output.connect(audioContext.destination)

  MIDI.programChange(0, 0);
  MIDI.programChange(1, 118);
  MIDI.programChange(2, 65);

  var onNotes = new Set(); // not sure if this is needed

  function noteOn(time, id){
    console.log('on', time, id)
    var [channel, note_id] = id
    if (indices[channel] == 0) {
      var velocity = 0
    } else {
      var velocity = 127
    }

    MIDI.noteOn(channel, note_id, velocity, time)
    onNotes.add(id);
  }

  function noteOff(time, id){
    if (onNotes.has(id)){
      console.log('off', time, id)
      var [channel, note_id] = id
      MIDI.noteOff(channel, note_id, time)
      onNotes.remove(id)
    }
  }

  scheduler.setTempo(120)
  setTimeout(function(){
    scheduler.start()
  }, 3000)
}

function onMidiLoaded() {
  alert("Let's begin!");
  console.log(MIDI.getContext());
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
