window.onload = function () {
  $('#next-round-btn').prop('disabled', !allSubmissionsReceived);

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