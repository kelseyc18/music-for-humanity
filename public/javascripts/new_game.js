$(function() {
  $('#new-game-form').submit(function(e) {
    e.preventDefault();
    var thisForm = $(e.currentTarget);

    var gameName = $('#gameName').val();
    var player_name1 = $('#player_name1').val();
    var player_name2 = $('#player_name2').val();
    var player_name3 = $('#player_name3').val();
    var player_name4 = $('#player_name4').val();

    $.ajax({
      type: thisForm.attr('method') || 'POST',
      url: thisForm.attr('action') || window.location.href,
      data: {
        gameName: gameName,
        player_name1: player_name1,
        player_name2: player_name2,
        player_name3: player_name3,
        player_name4: player_name4
      },
      success: function(data) {
        window.location.replace('/gameplay/game/' + data)
      }
    })
      .fail(function() {
        alert('error');
      });
  });
});
