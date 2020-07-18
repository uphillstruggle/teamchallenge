var express = require('express');
var router = express.Router();
	
router.get('/',   
	function(req, res, next){
		req.app.locals.db.getEvent(req, res, next);
	}, 
	function(req, res, next){
		req.app.locals.db.getAthletes(req, res, next);
	}, 
	function(req, res, next){
		res.render('leaderboard', { 
			event: res.event,
			athletes: res.athletes,
			user: req.user,
			title: res.event.shortname,
			description: res.event.description,
			shareimage: res.event.shareimage
		});
	}
);

module.exports = router;
