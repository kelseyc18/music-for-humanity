var mongoose = require('mongoose');
var Round = require('../models/round');
var Submission = require('../models/submission');

var async = require('async');

// Display list of all Rounds
exports.round_list = function(req, res) {
  res.send('NOT IMPLEMENTED: Round list');
}

// Display detail page for a specific Round
exports.round_detail = function(req, res) {
  res.send('NOT IMPLEMENTED: Round detail: ' + req.params.id);
}

exports.round_reset_submissions = function(req, res) {
  async.waterfall([

    function(next) {
      Round.findById(mongoose.Types.ObjectId(req.body.roundId))
        .populate('submissions')
        .exec(function(err, round) {
          if (err) return next(err);
          next(err, round);
        })
    },

    function(round, next) {
      var submissionIds = round.submissions.map(x => x._id);

      Submission.update({ _id: { $in: submissionIds } }, { isSubmitted: false })
        .exec(function(err, numAffected) {
          if (err) return next(err);
          next(err, numAffected);
        })

    }

  ], function(err, numAffected) {
    if (err) return res.send(err);
    res.send(numAffected);
  });
}

// Handle Round create on POST
exports.round_create_on_post = function(req, res) {
  res.send('NOT IMPLEMENTED: Round create POST');
}

// Handle Round update on POST
exports.round_update_on_post = function(req, res) {
  res.send('NOT IMPLEMENTED: Round update POST');
}
