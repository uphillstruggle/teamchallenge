var express = require('express');
var router = express.Router();

// Strava webhooks send the app notifications whenever an athlete posts
// a new activity or makes a change to their profile, subscription status
// or activities are updated or deleted. This function processes these 
// notifications.
router.post('/', 
	function(req, res, next){
		// 1. Get the athlete's refresh token from their DB record
		req.app.locals.db.lookupRefreshToken(req, res, next);
	},
	function(req, res, next){
		// 2 Get the activity types that qualify
		req.app.locals.db.getActivityTypes(req, res, next);
	}, 
	function(req, res, next){
		// 3. Use the refresh token to get a new access token
		req.app.locals.strava.fetchAccessToken(req, res, next);
	},
	function(req, res, next){
		// 4. Get the current athlete or activity data from strava
		req.app.locals.strava.fetchWebhookData(req, res, next);
	},
	function(req, res, next){
		// 5. Update athlete or activity recorda
		console.log("Activity types allowed - ", res.activity_types);
		console.log("This activity type - ", res.activity.type);
		req.app.locals.db.processWebhook(req, res, next);
	},
	function(req, res, next){
		// 6. Keep a record of the call
		req.app.locals.db.insertWebhookLog(req, res, next);
	},
	function(req, res, next){
		res.status(200).send('EVENT_RECEIVED');
	}
);

router.get('/', (req, res) => {
	// called once when a new subscription is established

	const VERIFY_TOKEN = process.env['VERIFY_TOKEN'];
	let mode = req.query['hub.mode'];
	let token = req.query['hub.verify_token'];
	let challenge = req.query['hub.challenge'];
	// Checks if a token and mode is in the query string of the request
	if (mode && token) {
		// Verifies that the mode and token sent are valid
		if (mode === 'subscribe' && token === VERIFY_TOKEN) {
			// Responds with the challenge token from the request
			console.log('WEBHOOK_VERIFIED');
			res.json({"hub.challenge":challenge});
		} else {
			// Responds with '403 Forbidden' if verify tokens do not match
			console.log('Message received', mode, token);
			res.sendStatus(403);
		}
	}
});
module.exports = router;
