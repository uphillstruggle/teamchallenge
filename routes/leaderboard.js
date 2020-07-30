var express = require('express');
var router = express.Router();
	
router.get('/',   
	function(req, res, next){
		req.app.locals.db.getEvent(req, res, next);
	}, 
	function(req, res, next){
		req.app.locals.db.getTotalDistance(req, res, next);
	}, 
	function(req, res, next){
		req.app.locals.db.getStages(req, res, next);
	}, 
	function(req, res, next){
		req.app.locals.db.getAthletes(req, res, next);
	}, 
	function(req, res, next){
		req.app.locals.db.getAthletesAllStages(req, res, next);
	}, 
	function(req, res, next){
		res.render('leaderboard', { 
			event: res.event,
			stage: res.stage,
			stages: res.stages,
			athletes: res.athletes,
			athletesbystage: res.stageLeaderboards,
			user: req.user,
			title: res.event.shortname,
			shareimage:res.stages[res.stage-1].image,
			titleimage:res.stages[res.stage-1].image,
		});
	}
);

module.exports = router;
