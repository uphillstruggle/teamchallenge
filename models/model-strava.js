const stravaApi = require('strava-v3');
var moment      = require('moment');

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
						if (res.activity_types.includes(activity.type)){
							qualifying_activities.push(activity);
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

module.exports = { fetchAndStoreActivities };

