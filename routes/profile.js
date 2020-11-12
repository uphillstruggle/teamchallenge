var express = require('express');
var router = express.Router();

function checkSignIn(req, res, next){
   if(req.session.passport && req.session.passport.user && (Date.now() - req.session.passport.user.tokenRefreshTime <= 3600)){
      next();
   } else {
	   res.redirect("/auth/login");
   }
}

router.get('/', checkSignIn, 
	function(req, res, next){
		req.app.locals.db.updateAthlete(req, res, next);
	}, 
	function(req, res, next){
		req.event_id = process.env['EVENT_ID'];
		req.app.locals.db.getEvent(req, res, next);
	}, 
	function(req, res, next){
		req.app.locals.db.getActivityTypesForEvent(req, res, next);
	}, 
	function(req, res, next){
		req.app.locals.strava.fetchAndStoreActivities(req, res, next);
	}, 
	function(req, res, next){

		res.render('profile', {
			pagename: 'profile',
			activities: res.activities,
			user: req.user,
			event: res.event, 
			activity_types: res.activity_types ,
			title: res.event.shortname,
			description: res.event.description,
			shareimage: res.event.shareimage,
			firebase_config: res.event.firebase_config,
			firebase_config2: res.event.firebase_config2,
		});
	}
);

module.exports = router;
