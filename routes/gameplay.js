var express = require('express');
var router = express.Router();

// Require controller modules
var game_controller = require('../controllers/gameController');
var player_controller = require('../controllers/playerController');
var round_controller = require('../controllers/roundController');
var submission_controller = require('../controllers/submissionController');


/// GAME ROUTES ///
router.get('/', game_controller.index);
router.get('/game/create', game_controller.new_game);
router.get('/game/:id', game_controller.game_detail);
router.post('/game/create', game_controller.game_create_on_post);
router.post('/game/:id/update', game_controller.game_update_on_post);


/// PLAYER ROUTES ///
router.get('/player/:id', player_controller.player_detail);
router.post('/player/create', player_controller.player_create_on_post);
router.post('/player/update', player_controller.player_update_on_post);

/// ROUND ROUTES ///
router.get('/rounds', round_controller.round_list);
router.get('/round/:id', round_controller.round_detail);
router.post('/round/reset', round_controller.round_reset_submissions);
router.post('/round/create', round_controller.round_create_on_post);
router.post('/round/update', round_controller.round_update_on_post);
router.post('/round/select_winner', round_controller.round_set_winner_on_post);
router.post('/round/clear_winner', round_controller.round_clear_winner_on_post);

/// SUBMISSION ROUTES ///
router.get('/submissions', submission_controller.submission_list);
router.get('/submission/:id', submission_controller.submission_detail);
router.post('/submission/create', submission_controller.submission_create_on_post);
router.post('/submission/update', submission_controller.submission_update_on_post);

module.exports = router;
