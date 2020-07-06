var express = require('express');
var router = express.Router();
var model = require('../models/model-mysql');

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
		res.render('index', { 
			event: res.event, 
			distance: res.distance,
			activity_types: res.activity_types
		});
	}
);

module.exports = router;
