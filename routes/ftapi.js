const express   = require('express');
const User      = require("../models/user");
const Place     = require("../models/place");

const router    = express.Router();
const auth      = require('../helpers/auth');

router.put('/secret', auth.checkLoggedIn('You must be logged in', '/login'), function(req, res, next) {
  User.findOne({ '_id': req.user._id }, (err, user) => {
    if (err) {
      return res.status(500).json({message: err});
    }
    user.joinPlace(req.body);
    res.json({message: "ok"});
  });
});

router.get('/markers', auth.checkLoggedIn('You must be logged in', '/login'), function(req, res, next) {
  Place.find({}, (err, places) => {
    if (err) {
      return res.status(500).json({message: err});
    }
    res.json(places);
  });
});

module.exports = router;
