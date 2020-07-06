var mysql      = require('mysql');
var moment      = require('moment');

	// establish DB connection
	var db_connection = mysql.createConnection({
	  host     : 'localhost',
	  user     : 'simplelb',
	  password : 'simplelb',
	  database : 'strava'
	});

	var event_id = process.env['EVENT_ID'];

	console.log ("DB initializing");
	db_connection.connect(function(err) {
	  if (err) {
		console.error('error connecting to MySQL: ' + err.stack);
		return;
	  }
	});

	function getEvent(req, res, next)
	{
		db_connection.query('SELECT * FROM `events` WHERE `id` = ?', event_id, function (error, results, fields) {
			if (error) throw error;

			// prepare event data for template output
			res.event = new Object();
			res.event.id = results[0].id;
			res.event.name = results[0].name;
			res.event.description = results[0].description;
			res.event.distance_goal = results[0].distance_goal;
			res.event.first_date = moment(results[0].first_date).format('LL');
			res.event.last_date = moment(results[0].last_date).format('LL');
			res.event.first_date_ts = moment(results[0].first_date).format('X');
			res.event.last_date_ts = moment(results[0].last_date).format('X');
		  next();
		});
	}
function getTotalDistance(req, res, next) {
		db_connection.query('SELECT SUM(`distance`) as `distance` FROM `activities`', function (error, results, fields) {
				if (error) throw error;
				res.distance = Math.round(results[0].distance/1000);
				next();
			});
	}

	function getActivities(req, res, next)
	{
		db_connection.query('SELECT concat(`ath`.`firstname`," ",substr(`ath`.`lastname`,1,1)), `act`.`name`,round(`act`.`distance`/1000,1),`act`.`type` FROM `activities` act, `athletes` ath WHERE act.`athlete_id` = ath.`id` ORDER BY `act`.`start_date` DESC', function (error, results, fields) {
				if (error) throw error;
				res.activities = results;
				next();
			});
	}

	function getAthletes(req, res, next)
	{
		db_connection.query('SELECT CONCAT(`ath`.`firstname`, " ", SUBSTR(`ath`.`lastname`,1,1)), `ath`.`country`, COUNT(`act`.`id`), ROUND(SUM(`act`.`distance`)/1000,1) FROM `athletes` ath, `activities` act GROUP BY ath.`id`', function (error, results, fields) {
				if (error) throw error;
				res.athletes = results;
				next();
			});
	}

	function getActivityTypes(req, res, next)
	{
		db_connection.query('SELECT `act`.`strava_name` FROM `activity_types` act, `activity_types_events` ae, `events` e WHERE ae.event_id = e.id and ae.activity_type_id = act.id and e.id = ?', event_id, function (error, results, fields) {
			if (error) throw error;

			// extract friendly name of activities from results and prepare for template output
			res.activity_types = new Array();
			results.forEach(function(item) { res.activity_types.push(item.strava_name); }); 

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
			values.push(activity.type);
			values.push(moment(activity.start_date).format('YYYY-MM-DD'));
			insertArray.push(values);
		});

		db_connection.query('REPLACE into `activities` (id, athlete_id,name, distance, type, start_date) values ?', [insertArray], 
			function (error, results, fields) {
				if (error) throw error;
			});

	}

	function updateAthlete(req,res,next)
	{
		var sql = mysql.format('REPLACE into `athletes` (id, firstname, lastname, country, sex, profile_medium, profile) values (?, ?, ?, ?, ?, ?, ?)', [
			req.user._json.id,
			req.user._json.firstname,
			req.user._json.lastname,
			req.user._json.country,
			req.user._json.sex,
			req.user._json.profile_medium,
			req.user._json.profile]);
		db_connection.query(sql, function (error, results, fields) {
				if (error) throw error;
				next();
			});
	};

module.exports = { getEvent, getActivityTypes, updateActivities, updateAthlete, getTotalDistance, getActivities, getAthletes};

