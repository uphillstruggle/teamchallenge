var express = require('express');
var router = express.Router();
	
router.post('/event',   
	function(req, res, next){
		req.app.locals.db.updateEvent(req, res, next);
	}, 
	function(req, res, next){
		req.app.locals.db.updateActivityTypes(req, res, next);
	}, 
	function(req, res, next){
		res.redirect('/admin/events');
	}
);

router.get('/event/:eventid',   
	function(req, res, next){
		req.event_id = req.params.eventid;
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
		res.render('admin-event', { 
			pagename: 'admin-event',
			event: res.event,
			activity_types: res.activity_types,
			stage: res.stage,
			stages: res.stages,
			user: req.user,
			title: 'Admin: Event',
		});
	}
);

router.get('/stage/:stageid',   
	function(req, res, next){
		req.app.locals.db.getStage(req, res, next);
	}, 
	function(req, res, next){
		res.render('admin-stage', { 
			pagename: 'admin-stage',
			stage: res.stage,
			user: req.user,
			title: 'Admin: Stage',
		});
	}
);

router.post('/stage',   
	function(req, res, next){
		req.app.locals.db.updateStage(req, res, next);
	}, 
	function(req, res, next){
		res.redirect('/admin/event/' + req.body.eventid);
	}
);

router.get('/events',   
	function(req, res, next){
		req.app.locals.db.getEventList(req, res, next);
	}, 
	function(req, res, next){
		res.render('admin-eventlist', { 
			pagename: 'admin-eventlist',
			events: res.events,
			user: req.user,
			title: 'Admin: event list'
		});
	}
);

module.exports = router;
