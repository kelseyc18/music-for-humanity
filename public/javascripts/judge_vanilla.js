$(function() {
  $('#reset-round-btn').click(function(event) {
    var data = {
      roundId: roundId
    }
    console.log(data);

    $.post('/gameplay/round/reset', data, function(res) {
      console.log(res);
      // location.reload(true);
    });
  });
});
