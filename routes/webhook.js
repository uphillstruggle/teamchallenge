var express = require('express');
var router = express.Router();

router.post('/', (req, res, next) => {
	req.app.locals.db.insertWebhookLog(req, res, next);
},
function(req, res, next){
	res.status(200).send('EVENT_RECEIVED');
});

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
