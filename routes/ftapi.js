const express   = require('express');
const User      = require("../models/user");
const Place     = require("../models/place");

const router    = express.Router();
const auth      = require('../helpers/auth');

router.put('/secret', auth.checkLoggedIn('You must be logged in', '/login'), function(req, res, next) {
  // res.render('secret', { user: JSON.stringify(req.user) });
  // console.log("User: ", req.user);
  User.findOne({ '_id': req.user._id }, (err, user) => {
    if (err) {
      return res.status(500).json({message: err});
    }
    // console.log('hi');
    // console.log('This is the user: ', req.user);
    // console.log(req.body);
    user.joinPlace(req.body);
    res.json({message: "ok"});
  });
});


module.exports = router;
