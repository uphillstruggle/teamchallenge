var express = require('express');
var router = express.Router();
	
router.get('/',   
	function(req, res, next){
		req.app.locals.db.getAthletes(req, res, next);
	}, 
	function(req, res, next){
		res.render('leaderboard', { 
			athletes: res.athletes
		});
	}
);

module.exports = router;
