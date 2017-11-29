$(function() {
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
})
