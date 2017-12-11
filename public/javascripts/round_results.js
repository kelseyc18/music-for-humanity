// winner_player.js

var Ditty = require('ditty');
var ditty = Ditty();
var Bopper = require('bopper');

/////////////////////////////////////////////////////////
///                 AUDIO SCHEDULER                   ///
/////////////////////////////////////////////////////////

var isPlaying = true;

function getInstrumentsToLoad(musicLines) {
  console.log(musicLines);
  return Array.from(new Set(musicLines.map(line => instrument_name_list[line.instrument])));
}

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

function stopAllNotes() {
  onNotes.forEach(function callback([channel, note_id]) {
    MIDI.noteOff(channel, note_id, 0);
  });
  onNotes.clear();
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

  winningLines.forEach(function(line, index) {
    if (index < 3) {
      var sequence = line.notesequence;
      var channel = index + 1;

      for (var note_id in sequence) {
        var val = sequence[note_id]
        var events;
        if (Array.isArray(val[0])) {
          events = val;
        } else {
          events = val.map(time => [time, line.notelength])
        }
        console.log('setting channel ', channel, ' note_id ', note_id, ' with events ', events);
        ditty.set([channel, note_id], events, 16)
      }

      MIDI.programChange(channel, line.instrument);
    }
  });


  // mixer
  var output = audioContext.createGain()
  output.gain.value = 0.5
  output.connect(audioContext.destination)

  scheduler.setTempo(tempo);
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
  stopAllNotes();
  player.seekTo(0);
  player.playVideo();
  scheduler.setPosition(0);
}

/////////////////////////////////////////////////////////
///                    GAME LOGIC                     ///
/////////////////////////////////////////////////////////

function toggleAudio() {
  for(var i = 1; i <= 16; i++) {
    MIDI.setVolume(i, isPlaying ? 0 : 127);
  }
  isPlaying = !isPlaying;
}

function onMidiLoaded() {
  initializeScheduler();

  // set up button click handlers
  $('#volume-button').click(function(event) {
    toggleAudio();
  });
}

$(function() {
  $('.content').css('visibility', 'hidden');
  $('#loading').show();

  $('#next-round-btn').click(function() {
    var data = {
      gameId: gameId
    };

    $.post('/gameplay/round/create', data, function(res) {
      console.log(res);
      location.reload(true);
    });
  });

  $('#clear-winner-btn').click(function() {
    var data = {
      roundId: roundId
    };

    $.post('/gameplay/round/clear_winner', data, function(res) {
      console.log(res);
      location.reload(true);
    });
  })

  $('#volume-button').click(function() {
    if ($('#volume-icon').hasClass('fa-volume-off')) {
      $('#volume-icon').removeClass('fa-volume-off').addClass('fa-volume-up');
    } else {
      $('#volume-icon').removeClass('fa-volume-up').addClass('fa-volume-off');
    }
  });
});

window.onload = function () {
  instruments_to_load = getInstrumentsToLoad(winningLines);
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
}
