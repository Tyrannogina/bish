var express = require('express');
var router  = express.Router();
var auth    = require('../helpers/auth');
const Place = require("../models/place");


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Find Tandem' });
});

router.get('/secret', auth.checkLoggedIn('You must be logged in', '/login'), function(req, res, next) {
  res.render('secret', { user: JSON.stringify(req.user) });
});

router.get('/admin', auth.checkLoggedIn('You must be logged in', '/login'), auth.checkCredentials('ADMIN'), function(req, res, next) {
	// console.log(req.user);
  res.render('admin', { user: JSON.stringify(req.user) });
});

router.get('/secret/places/:idPlace', auth.checkLoggedIn('You must be logged in', '/login'), function(req, res, next) {
  // Place.findOne({ '_id': req.params.idPlace }, (err, place) => {
  //   if (err) {
  //     return res.status(500).json({message: err});
  //   }
  //   res.render('place', { user: JSON.stringify(req.user), place: place });
  // });
  // Place.findOne({ '_id': req.params.idPlace }).populate('users').exec(function (err, user) {
  //   console.log('Users are: ', user);
  //   res.render('place', { user: JSON.stringify(req.user), place: req.place, dataUser: user });
  // });
  Place.findOne({ '_id': req.params.idPlace }, (err, place) => {
    if (err) {
      return res.status(500).json({message: err});
    }
    Place.findOne({ '_id': req.params.idPlace }).populate('users').exec(function (err, users) {
      if (err) {
        return res.status(500).json({message: err});
      }
      res.render('place', { user: JSON.stringify(req.user), place: place, users: users });
    });
  });


//   router.get('/', (req, res, next) => {
//   Media.find({}, (err, media) => {
//     if (err) { return next(err) }
//     Media
//       .find({})
//       .populate("questions.questionId")
//       .exec((err, media) => {
//         if (err) {
//           next(err);
//           return;
//         }
//         res.json({media});
//       });
// });
// });
//   

});

router.get('/secret/user', auth.checkLoggedIn('You must be logged in', '/login'), function(req, res, next) {
  res.render('user', { user: JSON.stringify(req.user), dataUser: req.user });
});

module.exports = router;
