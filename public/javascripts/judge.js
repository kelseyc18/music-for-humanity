// judge.js

var Ditty = require('ditty');
var ditty = Ditty();
var Bopper = require('bopper');

window.onload = function () {
  $('#reset-round-btn').click(function(event) {
    var data = {
      roundId: roundId
    }

    $.post('/gameplay/round/reset', data, function(res) {
      console.log(res);
      location.reload(true);
    });
  });
}
