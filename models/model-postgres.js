const { Pool, Client } = require('pg')
var moment = require('moment');
var format = require('pg-format');
// pools will use environment variables
// for connection information
const pool = new Pool()

	var event_id = process.env['EVENT_ID'];

	function getEvent(req, res, next)
	{
		pool.query('SELECT * from strava.events WHERE id = $1', [event_id], (error, results) => {
			// prepare event data for template output
			res.event = new Object();
			res.event.id = results.rows[0].id;
			res.event.name = results.rows[0].name;
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
		pool.query('SELECT SUM(distance) as distance FROM strava.activities', function (error, results) {
				if (error) throw error;
				res.distance = Math.round(results.rows[0].distance/1000);
				console.log(res.distance);
				next();
			});
	}

	function getActivities(req, res, next)
	{
		pool.query('SELECT concat(ath.firstname,\' \',substr(ath.lastname,1,1)), act.name,round(act.distance/1000,1),act.type FROM strava.activities act, strava.athletes ath WHERE act.athlete_id = ath.id ORDER BY act.start_date DESC', function (error, results) {
				if (error) throw error;
				res.activities = results.rows;
				console.log(res.activities);
				next();
			});
	}

	function getAthletes(req, res, next)
	{
		pool.query('SELECT CONCAT(ath.firstname,\' \', SUBSTR(ath.lastname,1,1)), ath.country, COUNT(act.id), ROUND(SUM(act.distance)/1000,1) FROM strava.athletes ath, strava.activities act GROUP BY ath.id', function (error, results) {
				if (error) throw error;
				res.athletes = results.rows;
				console.log(res.athletes);
				next();
			});
	}

	function getActivityTypes(req, res, next)
	{
		pool.query('SELECT act.strava_name FROM strava.activity_types act, strava.activity_types_events ae, strava.events e WHERE ae.event_id = e.id and ae.activity_type_id = act.id and e.id = $1', [event_id], function (error, results) {
			if (error) throw error;

			// extract friendly name of activities from results and prepare for template output
			res.activity_types = new Array();
			results.rows.forEach(function(item) { res.activity_types.push(item.strava_name); }); 
			console.log(res.activity_types);
		  next();
		});
	};

	function updateActivities(activities)
	{
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
		pool.query(sql, function (error, results) {
				if (error) throw error;
			});

	}

	function updateAthlete(req,res,next)
	{
		console.log(req.user);
		var sql = format('INSERT into strava.athletes (id, username, firstname, lastname, country, sex, profile_medium, profile) values (%L, %L, %L, %L, %L, %L, %L, %L) ON CONFLICT (id) DO UPDATE SET username=EXCLUDED.username, firstname=EXCLUDED.firstname, lastname=EXCLUDED.lastname, country=EXCLUDED.country, sex=EXCLUDED.sex, profile_medium=EXCLUDED.profile_medium, profile=EXCLUDED.profile', 
			req.user._json.id,
			req.user._json.username,
			req.user._json.firstname,
			req.user._json.lastname,
			req.user._json.country,
			req.user._json.sex,
			req.user._json.profile_medium,
			req.user._json.profile);
		pool.query(sql, function (error, results) {
				if (error) throw error;
				next();
			});
	};

module.exports = { getEvent, getActivityTypes, updateActivities, updateAthlete, getTotalDistance, getActivities, getAthletes};

