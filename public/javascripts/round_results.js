$(function() {
  $('#next-round-btn').click(function() {
    var data = {
      gameId: gameId
    };

    $.post('/gameplay/round/create', data, function(res) {
      console.log(res);
      location.reload(true);
    });
  })
})
