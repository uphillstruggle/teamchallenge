var express = require('express');
var router = express.Router();

router.post('/', (req, res) => {
    console.log("webhook POST event received!", req.query, req.body);
	req.app.locals.db.insertWebhookLog(req, res, next);

	res.status(200).send('EVENT_RECEIVED');
});

module.exports = router;
