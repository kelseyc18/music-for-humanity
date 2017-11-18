var express = require('express');
var router = express.Router();

// Require controller modules
var game_controller = require('../controllers/gameController');
var player_controller = require('../controllers/playerController');
var round_controller = require('../controllers/roundController');
var submission_controller = require('../controllers/submissionController');


/// GAME ROUTES ///
router.get('/', game_controller.index);
router.get('/game/:id', game_controller.game_detail);
router.post('/game/create', game_controller.game_create_on_post);
router.post('/game/:id/update', game_controller.game_update_on_post);


/// PLAYER ROUTES ///
router.get('/players', player_controller.player_list);
router.get('/player/:id', player_controller.player_detail);
router.post('/player/create', player_controller.player_create_on_post);
router.post('/player/:id/update', player_controller.player_update_on_post);


/// ROUND ROUTES ///
router.get('/rounds', round_controller.round_list);
router.get('/round/:id', round_controller.round_detail);
router.post('/round/create', round_controller.round_create_on_post);
router.post('/round/:id/update', round_controller.round_update_on_post);


/// SUBMISSION ROUTES ///
router.get('/submissions', submission_controller.submission_list);
router.get('/submission/:id', submission_controller.submission_detail);
router.post('/submission/create', submission_controller.submission_create_on_post);
router.post('/submission/:id/update', submission_controller.submission_update_on_post);

module.exports = router;
