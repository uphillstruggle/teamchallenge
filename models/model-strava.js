const stravaApi = require('strava-v3');
var moment      = require('moment');
const request = require('request-promise')

function fetchAccessToken(req, res, next)
{
	// use athlete's refresh token to get a current access token to fetch their data
	if (typeof req.refreshToken === 'undefined') {
		throw(new Error("Refresh token not found"));
	}

	// Strava node module doesn't offer a callback version of the refresh token
	// request, so we're going to roll our own here:
	return request({
		method: 'POST',
		url: 'https://www.strava.com/oauth/token',
		json: true,
		qs: {
			refresh_token: req.refreshToken, 
			client_secret: process.env.STRAVA_CLIENT_SECRET,
			client_id:  process.env.STRAVA_CLIENT_ID,
			grant_type: 'refresh_token'
		}}, function(err,payload,limits) { 
			if (err) throw(err);
			console.log("Strava returned access token:", payload.body.access_token);
			req.accessToken=payload.body.access_token;
			next();
		}
	);
}

function fetchWebhookData(req, res, next)
{
	// use athlete's refresh token to get a current access token to fetch their data
	if (typeof req.accessToken === 'undefined') {
		throw(new Error("Access token not found"));
	}
	req.webhook_aspect_type = req.body['aspect_type'];
	req.webhook_object_type = req.body['object_type'];
	req.webhook_object_id = req.body['object_id'];
	req.webhook_owner_id = req.body['owner_id'];
	console.log("Webhook call received: ", req.webhook_aspect_type, req.webhook_object_type, req.webhook_object_id, req.webhook_owner_id);

	// delete requests don't require any fetching from strava
	if (req.webhook_aspect_type === 'delete')
	{
		next();
		return;
	}

	var strava = new stravaApi.client(req.accessToken);

	switch(req.webhook_object_type)
	{
		case 'athlete':
			console.log('Athlete webhook request: ', req.webhook_object_id);
			strava.athlete.get({id:req.webhook_object_id},
				function(err,payload,limits) {
					if(err) throw(err);

					res.athlete = payload;
					next();
				});
			break;
		case 'activity':
			console.log('Activity webhook request: ', req.webhook_object_id);
			strava.activities.get({id:req.webhook_object_id},
				function(err,payload,limits) {
					if(err) throw(err);

					res.activity = payload;
					next();
				});
			break;
		default:
			console.log('Unknown webhook request type: ', req.webhook_aspect_type, req.webhook_object_type, req.webhook_object_id);
			next();
	}

};

function fetchAndStoreActivities(req, res, next)
{
	res.activities = [];
	// don't call strava if event starts in the future or it will give an error
	if (res.event.first_date_ts <= moment().format('x'))
	{
		var strava = new stravaApi.client(req.user.accessToken);

		// request athlete activities within event from and to dates
		strava.athlete.listActivities({ before: res.event.last_date_ts, after: res.event.first_date_ts},function(err,payload,limits) {
			if(!err) {
				
				// filter out the activities of the right type for this event
				var qualifying_activities = new Array();
				payload.forEach(function(activity) { 
						for (var i=0; i<res.activity_types.length; i++)
						{
							if (res.activity_types[i].name === activity.type 
								&& res.activity_types[i].allowed){
								qualifying_activities.push(activity);
							}
						}
					});
				
				res.activities = qualifying_activities.map(makeTable);

				// store these to DB if needed
				req.app.locals.db.updateActivities(qualifying_activities);

				// build formatted table of activities
				function makeTable(activity, index, array) {
					var row = new Array();
					row.push(index+1);
					row.push(activity.name);
					row.push(activity.type);
					var actDate = new Date(activity.start_date_local);
					row.push(actDate.toLocaleDateString());
					row.push(Math.round(activity.distance/100)/10);
					return row;
				};
				next();
			}
			else {
				throw err;
			} 
		});
	}
	else
	{
		// not an error - continue with empty list of activities
		next();
	}
}; 

module.exports = { fetchAndStoreActivities, fetchWebhookData, fetchAccessToken };

