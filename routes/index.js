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
		req.app.locals.db.getActivityTypes(req, res, next);
	}, 
	function(req, res, next){
		req.app.locals.db.getStages(req, res, next);
	}, 
	function(req, res, next){
		req.app.locals.db.getActivities(req, res, next);
	}, 
	function(req, res, next){
		req.app.locals.db.getAthletes(req, res, next);
	}, 
	function(req, res, next){
		res.render('index', { 
			pagename: 'home',
			event: res.event, 
			distance: res.distance,
			activity_types: res.activity_types,
			activities: res.activities,
			stages: res.stages,
			stage: res.stage,
			athletes: res.athletes,
			user: req.user,
			title: res.event.shortname,
			description: res.event.description,
			shareimage:res.stages[res.stage-1].image,
			titleimage:res.stages[res.stage-1].image,
			firebase_config: res.event.firebase_config,
		});
	}
);

module.exports = router;
