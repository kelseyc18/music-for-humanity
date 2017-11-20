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
  'melody': 1,
  'percussion': 5,
  'bass': 11
}

var channelOn = [false, true, false, false, false, true, false, false, false, false, false, true, false, false, false, false];

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

console.log(getChannelNumber(MELODY, 0));

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

  console.log('next melody');
  for(i = 0; i < 4; i++) {
    if(i == offsets['melody']) {
      channelOn[getChannelNumber(MELODY, i)] = true;
      console.log('play channel', getChannelNumber(MELODY, i), channelOn[getChannelNumber(MELODY, i)]);
    } else {
      channelOn[getChannelNumber(MELODY, i)] = false;
      console.log('mute channel', getChannelNumber(MELODY, i), channelOn[getChannelNumber(MELODY, i)]);
    }
  }
  updateMelodyButton();
}

function nextPercussion() {
  percussionIndex = offsets['percussion']
  offsets['percussion'] = (percussionIndex + 1) % NUM_PERCUSSION_STATES;

  console.log('next percussion');
  for(i = 0; i < 4; i++) {
    if(i == offsets['percussion']) {
      console.log('play channel', getChannelNumber(PERCUSSION, i));
      channelOn[getChannelNumber(PERCUSSION, i)] = true;
    } else {
      console.log('mute channel', getChannelNumber(PERCUSSION, i));
      channelOn[getChannelNumber(PERCUSSION, i)] = false;
    }
  }
  updatePercussionButton();
}

function nextBass() {
  bassIndex = offsets['bass']
  offsets['bass'] = (bassIndex + 1) % NUM_BASS_STATES;

  console.log('next bass');
  for(i = 0; i < 4; i++) {
    if(i == offsets['bass']) {
      console.log('play channel', getChannelNumber(BASS, i));
      channelOn[getChannelNumber(BASS, i)] = true;
    } else {
      console.log('mute channel', getChannelNumber(BASS, i));
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

  ////////// Hard Coded "Cards" //////////

  // melody line 0
  // [[[81,0,78,79,81,0,78,79]],[[81,69,71,73,74,76,78,79]],
  // [[78,0,74,76,78,0,66,67]],[[69,71,69,67,69,66,67,69]], 
  // [[67,0,71,69,67,0,66,64]],[[66,64,62,64,66,67,69,71]], 
  // [[67,0,71,69,71,0,73,74]],[[69,71,73,74,76,78,79,81]]]

  // bass line 2
  // [[50,54,57,62], [45,49,52,57], [47,50,54,59], [42,45,49,54],
  // [43,47,50,55], [38,42,45,50], [43,47,50,55], [45,49,52,57]]

  var melody_times_0 = {0: [0.5, 2.5, 8.5, 10.5, 16.5, 18.5, 24.5, 26.5],
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

  var melody_times_3 = {61: [4.0],
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

  var melody_times = melody_times_0
  for (var note_id in melody_times) {
    var val = melody_times[note_id]
    var events = val.map(time => [time, 0.4])
    ditty.set([1, note_id], events, 32)
  }

  var melody_times = melody_times_3
  for (var note_id in melody_times) {
    var val = melody_times[note_id]
    var events = val.map(time => [time, 0.8])
    ditty.set([4, note_id], events, 32)
  }

  for (var note_id in bass_times) {
    var val = bass_times[note_id]
    var events = val.map(time => [time, 0.8])
    ditty.set([3, note_id], events, 32)
  }

  // melodyLines.forEach(function(line, index) {
  //   if(index < 3) {
  //     var offset = index + 1;
  //     var sequence = line.notesequence;
  //     var channel = getChannelNumber(MELODY, offset);

  //     for (var note_id in sequence) {
  //       var val = sequence[note_id]
  //       var events = val.map(time => [time, line.notelength])
  //       ditty.set([channel, note_id], events, 32)
  //     }

  //     MIDI.programChange(channel, 0);
  //   }
  // });

  // bassLines.forEach(function(line, index) {
  //   if(index < 3) {
  //     var offset = index + 1;
  //     var sequence = line.notesequence;
  //     var channel = getChannelNumber(BASS, offset);

  //     for (var note_id in sequence) {
  //       var val = sequence[note_id]
  //       var events = val.map(time => [time, line.notelength])
  //       ditty.set([channel, note_id], events, 32)
  //     }

  //     MIDI.programChange(channel, 65);
  //   }
  // });

  // percussionLines.forEach(function(line, index) {
  //   if(index < 3) {
  //     var offset = index + 1;
  //     var sequence = line.notesequence;
  //     var channel = getChannelNumber(PERCUSSION, offset);

  //     for (var note_id in sequence) {
  //       var val = sequence[note_id]
  //       var events = val.map(time => [time, line.notelength])
  //       ditty.set([channel, note_id], events, 32)
  //     }

  //     MIDI.programChange(channel, 118);
  //   }
  // });

  //////////////////////////////

  // mixer
  var output = audioContext.createGain()
  output.gain.value = 0.5
  output.connect(audioContext.destination)

  var onNotes = new Set(); // not sure if this is needed

  MIDI.programChange(1, 0);
  MIDI.programChange(2, 118);
  MIDI.programChange(3, 65);

  MIDI.programChange(4, 0);
  MIDI.programChange(5, 118);
  MIDI.programChange(6, 65);

  MIDI.programChange(7, 0);
  MIDI.programChange(8, 118);
  MIDI.programChange(9, 65);

  function noteOn(time, id){
    var [channel, note_id] = id
    // console.log('[on] time', time, 'channel', channel, 'note_id', note_id)

    // if ((indices['melody'] > 0 && 3 * (indices['melody'] - 1) + 1 == channel) ||
    //     (indices['percussion'] > 0 && 3 * (indices['percussion'] - 1) + 2 == channel) ||
    //     (indices['bass'] > 0 && 3 * (indices['bass'] - 1) + 3 == channel)) {
    //       var velocity = 127
    //   } else {
    //   var velocity = 0
    // }

    // MIDI.noteOn(channel, note_id, channelOn[channel] ? 127 : 0, time)
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

  scheduler.setTempo(120)
  setTimeout(function(){
    scheduler.start()
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
    playerId: playerId
  };

  $.post('/gameplay/submission/update', data, function(res) {
    console.log(res);
    location.reload(true);
  });
}

function onMidiLoaded() {
  alert("Let's begin!");
  console.log(MIDI.getContext());
  // initializeScheduler();

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

  if(isSubmitted) {
    $('#publish-submission-btn').prop('disabled', true);
  }

  if(roundNumber == 2) animateSnail();
}

window.onload = function () {
  // load MIDI plugin
  MIDI.loadPlugin({
    // soundfontUrl: "http://gleitz.github.io/midi-js-soundfonts/FluidR3_GM/",
    // instrument: [ 
    //   "acoustic_grand_piano",
    //   "synth_drum",
    //   "alto_sax",
    //   "acoustic_guitar_nylon",
    //   "electric_bass_pick",
    //   "clarinet",
    //   "flute",
    //   "synth_bass_1",
    //   "harmonica",
    //   "timpani",
    //   "trumpet",
    //   "woodblock",
    //   "synth_choir",
    //   "drawbar_organ"
    // ],
    soundfontUrl: "/javascripts/midi/soundfont/",
    instrument: [ "acoustic_grand_piano", "synth_drum", "alto_sax" ],
    onprogress: function(state, progress) {
      console.log(state, progress);
    },
    onsuccess: onMidiLoaded
  });
};
