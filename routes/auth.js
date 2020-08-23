var express = require('express');
var passport = require('passport');
var router = express.Router();

/* call Strava login */
router.get('/login', passport.authenticate('strava', { failureRedirect: '/auth/error', failureFlash: true }));

router.get('/callback', passport.authenticate('strava', { successRedirect: '/profile', failureRedirect: '/auth/error' }));

router.get('/error', function(req, res, next) {
	error = new Error("Cannot login", req.session);
	res.render('error');
});

router.get('/success', function(req, res, next) {
	res.render('success');
});

router.get('/logout', function(req, res, next) {
	req.logout();
	res.redirect('/');
});


module.exports = router;
