const { Client } = require('pg');
var moment = require('moment');
var format = require('pg-format');

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

client.connect();

	var event_id = process.env['EVENT_ID'];

	function getEvent(req, res, next)
	{
		client.query('SELECT * from strava.events WHERE id = $1', [event_id], (error, results) => {
			if (error) throw error;
			//
			// prepare event data for template output
			res.event = new Object();
			res.event.id = results.rows[0].id;
			res.event.name = results.rows[0].name;
			res.event.shortname = results.rows[0].name;
			res.event.description = results.rows[0].description;
			res.event.distance_goal = results.rows[0].distance_goal;
			res.event.first_date = moment(results.rows[0].first_date).format('LL');
			res.event.last_date = moment(results.rows[0].last_date).format('LL');
			res.event.first_date_ts = moment(results.rows[0].first_date).format('X');
			res.event.last_date_ts = moment(results.rows[0].last_date).format('X');
			next();
		});
	}



function getTotalDistance(req, res, next) {
		client.query('SELECT SUM(distance) as distance FROM strava.activities WHERE start_date >= $1 AND start_date <= $2', [res.event.first_date, res.event.last_date], function (error, results) {
				if (error) throw error;
				res.distance = Math.round(results.rows[0].distance/1000);
				next();
			});
	}

	function getActivities(req, res, next)
	{
		client.query('SELECT act.id, TO_CHAR(act.start_date,\'dd/mm/yyyy\') as date, concat(ath.firstname,\' \',substr(ath.lastname,1,1)) as athlete, act.name,round(act.distance/1000,1) as distance,act.type FROM strava.activities act, strava.athletes ath WHERE act.athlete_id = ath.id AND act.start_date >= $1 AND act.start_date <= $2 ORDER BY 1 DESC LIMIT 15', [res.event.first_date, res.event.last_date], function (error, results) {
				if (error) throw error;
				res.activities = results.rows;
				next();
			});
	}

	function getAthletes(req, res, next)
	{
		// Left join here ensures that athletes who have not yet
		// logged a ride are still listed. Coalesce() gives them 
		// a total distance of 0.
		client.query('SELECT CONCAT(ath.firstname,\' \', SUBSTR(ath.lastname,1,1)), ath.country, COUNT(act.id), COALESCE(ROUND(SUM(act.distance)/1000,1),0) FROM strava.athletes ath LEFT JOIN strava.activities act ON ath.id = act.athlete_id WHERE (act.start_date >= $1 AND act.start_date <= $2) OR act IS NULL GROUP BY ath.id ORDER BY 4 DESC LIMIT 15', [res.event.first_date, res.event.last_date], function (error, results) {
				if (error) throw error;
				res.athletes = results.rows;
				next();
			});
	}

	function getActivityTypes(req, res, next)
	{
		client.query('SELECT act.strava_name FROM strava.activity_types act, strava.activity_types_events ae, strava.events e WHERE ae.event_id = e.id and ae.activity_type_id = act.id and e.id = $1', [event_id], function (error, results) {
			if (error) throw error;

			// extract friendly name of activities from results and prepare for template output
			res.activity_types = new Array();
			results.rows.forEach(function(item) { res.activity_types.push(item.strava_name); }); 
		  next();
		});
	};

	function updateActivities(activities)
	{
		if (activities.length == 0)
			return;

		var insertArray = new Array();
		activities.forEach(function(activity) {
			var values = new Array();
			values.push(activity.id);
			values.push(activity.athlete.id);
			values.push(activity.name);
			values.push(activity.distance);
			values.push(activity.total_elevation_gain);
			values.push(activity.type);
			values.push(moment(activity.start_date).format('YYYY-MM-DD'));
			insertArray.push(values);
		});

		var sql = format('INSERT into strava.activities (id, athlete_id,name, distance, total_elevation_gain, type, start_date) values %L ON CONFLICT (id) DO UPDATE set athlete_id = EXCLUDED.athlete_id, name=EXCLUDED.name, distance=EXCLUDED.distance, total_elevation_gain=EXCLUDED.total_elevation_gain, type=EXCLUDED.type, start_date=EXCLUDED.start_date', insertArray);
		client.query(sql, function (error, results) {
				if (error) throw error;
			});

	}

	function updateAthlete(req,res,next)
	{
		var sql = format('INSERT into strava.athletes (id, username, firstname, lastname, country, sex, profile_medium, profile, access_token, refresh_token) values (%L, %L, %L, %L, %L, %L, %L, %L, %L, %L) ON CONFLICT (id) DO UPDATE SET username=EXCLUDED.username, firstname=EXCLUDED.firstname, lastname=EXCLUDED.lastname, country=EXCLUDED.country, sex=EXCLUDED.sex, profile_medium=EXCLUDED.profile_medium, profile=EXCLUDED.profile, access_token=EXCLUDED.access_token, refresh_token=EXCLUDED.refresh_token', 
			req.user._json.id,
			req.user._json.username,
			req.user._json.firstname,
			req.user._json.lastname,
			req.user._json.country,
			req.user._json.sex,
			req.user._json.profile_medium,
			req.user._json.profile,
			req.user.accessToken,
			req.user.refreshToken);
		client.query(sql, function (error, results) {
				if (error) throw error;
				next();
			});
	};

	function lookupRefreshToken(req,res,next)
	{
		var athlete_id = req.body['owner_id'];
		// fetch the refresh token from an athlete's record 
		client.query('SELECT refresh_token from strava.athletes WHERE id = $1', [athlete_id], (error, results) => {
			if (error) throw error;
			req.refreshToken = results.rows[0].refresh_token;
			console.log("Athlete ID, refresh token: ", athlete_id, req.refreshToken);
			next();
		});
	};

	function processWebhook(req,res,next)
	{
		console.log("processWebhook");
		if (req.webhook_aspect_type === 'delete')
		{
			console.log("delete request");
			// delete activity or athlete
			if (req.webhook_object_type === 'activity')
			{
				client.query('DELETE from activities WHERE id = $1', [req.webhook_object_id], (error, results) => {
					if (error) throw error;
					console.log("Deleted activity ID ", req.webhook_object_id);
					next();
				});
			}
			else if (req.webhook_object_type === 'athlete')
			{
				client.query('DELETE from athletes WHERE id = $1', [req.webhook_object_id], (error, results) => {
					if (error) throw error;
					console.log("Deleted athlete ID ", req.webhook_object_id);
					next();
				});
			}
			return;
		}

		if (req.webhook_object_type === 'activity')
		{
			console.log("activity request");
			// check activity is one of the right type
			if (res.activity_types.indexOf(res.activity.type) == -1) {
				// ignore this activity
				console.log ("Activity type is not valid for event", res.activity.id, res.activity.type);
				next();
				return;
			}

			// insert or update activity
			var sql = format('INSERT into strava.activities (id, athlete_id,name, distance, total_elevation_gain, type, start_date) values (%L,%L,%L,%L,%L,%L,%L) ON CONFLICT (id) DO UPDATE set athlete_id = EXCLUDED.athlete_id, name=EXCLUDED.name, distance=EXCLUDED.distance, total_elevation_gain=EXCLUDED.total_elevation_gain, type=EXCLUDED.type, start_date=EXCLUDED.start_date', res.activity.id, res.activity.athlete.id, res.activity.name, res.activity.distance, res.activity.total_elevation_gain, res.activity.type, moment(res.activity.start_date).format('YYYY-MM-DD'));
			console.log("Executing sql: ", sql);
			client.query(sql, function (error, results) {
					if (error) throw error;
					console.log("Successfully updated activity ",res.activity.id);
					next();
				});
		}
		else if (req.webhook_object_type === 'athlete' && req.webhook_aspect_type === 'update' )
		{
			console.log("athlete update request");
			// update athlete (insert handled by profile)
			var sql = format('UPDATE strava.athletes SET username=%L, firstname=%L, lastname=%L, country=%L, sex=%L, profile_medium=%L, profile=%L, access_token=%L, refresh_token=%L WHERE id = %L', 
				res.athlete.username,
				res.athlete.firstname,
				res.athlete.lastname,
				res.athlete.country,
				res.athlete.sex,
				res.athlete.profile_medium,
				res.athlete.profile,
				res.accessToken,
				res.refreshToken,
				res.athlete.id);
			console.log("Executing sql: ", sql);
			client.query(sql, function (error, results) {
					if (error) throw error;
					console.log("Successfully updated athlete ",res.athlete.id);
					next();
				});
		}
	}

	function insertWebhookLog(req,res,next)
	{
		console.log("insertWebhookLog: ", sql);
		let aspect_type = req.body['aspect_type'];
		let event_time = req.body['event_time'];
		let object_id = req.body['object_id'];
		let object_type = req.body['object_type'];
		let owner_id = req.body['owner_id'];
		let subscription_id = req.body['subscription_id'];
		let updates = req.body['updates'];

		// insert query contents into DB
		var sql = format('INSERT INTO webhook_messages (aspect_type, event_time, object_id, object_type, owner_id, subscription_id, updates, received_at, http_type) VALUES (%L, %L, %L, %L, %L, %L, %L, NOW(), \'POST\')', aspect_type, event_time, object_id, object_type, owner_id, subscription_id, updates);
		console.log("Executing sql: ", sql);
		client.query(sql, function (error, results) {
				if (error) throw error;
				next();
			});
	}

module.exports = { getEvent, getActivityTypes, updateActivities, updateAthlete, getTotalDistance, getActivities, getAthletes, processWebhook, lookupRefreshToken, insertWebhookLog};

