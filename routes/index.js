var express = require('express');
var router = express.Router();

router.get('/',   
	function(req, res, next){
		req.event_id = process.env['EVENT_ID'];
		req.app.locals.db.getEvent(req, res, next);
	}, 
	function(req, res, next){
		req.params.charityid=1;
		req.app.locals.db.getCharity(req, res, next);
	}, 
	function(req, res, next){
		req.app.locals.db.getTotalDistance(req, res, next);
	}, 
	function(req, res, next){
		req.app.locals.db.getActivityTypesForEvent(req, res, next);
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
			shareimage:res.event.shareimage,
			stage_image: res.stage? res.stages[res.stage-1].image:'',
			event_image:res.event.shareimage,
			charity_image:res.charity.banner_image,
			firebase_config: res.event.firebase_config,
			firebase_config2: res.event.firebase_config2,
		});
	}
);

module.exports = router;
