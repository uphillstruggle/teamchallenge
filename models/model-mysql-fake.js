var moment      = require('moment');


	console.log ("Fake DB initializing");

	function getEvent(req, res, next)
	{
		res.event = {
		  id: 2,
		  name: "Simon's 1000km challenge",
		  description: 'Join me in cycling 1000km in one day to try out the TeamChallenge application and make sure everything is working correctly',
		  distance_goal: 1000,
		  first_date: 'July 1, 2020',
		  last_date: 'July 31, 2020',
		  first_date_ts: '1593558000',
		  last_date_ts: '1596150000'
		};
		next();
	}
function getTotalDistance(req, res, next) {
		res.distance = 185;
		next();
	}

	function getActivities(req, res, next)
	{
		res.activities = [
  {
    'concat(`ath`.`firstname`," ",substr(`ath`.`lastname`,1,1))': 'Simon B',
    name: 'Sunny Chislehurst',
    'round(`act`.`distance`/1000,1)': 17.6,
    type: 'Ride'
  },
  {
    'concat(`ath`.`firstname`," ",substr(`ath`.`lastname`,1,1))': 'Simon B',
    name: 'Greenwich',
    'round(`act`.`distance`/1000,1)': 14.2,
    type: 'Ride'
  },
  {
    'concat(`ath`.`firstname`," ",substr(`ath`.`lastname`,1,1))': 'Simon B',
    name: "L'Etape du Tour Stage 1 with turbo mechanicals",
    'round(`act`.`distance`/1000,1)': 30.3,
    type: 'VirtualRide'
  },
  {
    'concat(`ath`.`firstname`," ",substr(`ath`.`lastname`,1,1))': 'Simon B',
    name: 'Evening Ride',
    'round(`act`.`distance`/1000,1)': 0,
    type: 'Ride'
  },
  {
    'concat(`ath`.`firstname`," ",substr(`ath`.`lastname`,1,1))': 'Simon B',
    name: 'FFCC much faffing',
    'round(`act`.`distance`/1000,1)': 61.8,
    type: 'Ride'
  },
  {
    'concat(`ath`.`firstname`," ",substr(`ath`.`lastname`,1,1))': 'Simon B',
    name: "Delivery run to Igor's",
    'round(`act`.`distance`/1000,1)': 21.9,
    type: 'Ride'
  },
  {
    'concat(`ath`.`firstname`," ",substr(`ath`.`lastname`,1,1))': 'Simon B',
    name: 'London',
    'round(`act`.`distance`/1000,1)': 21.7,
    type: 'VirtualRide'
  },
  {
    'concat(`ath`.`firstname`," ",substr(`ath`.`lastname`,1,1))': 'Simon B',
    name: 'Yorkshire',
    'round(`act`.`distance`/1000,1)': 17.5,
    type: 'VirtualRide'
  }
]
		next();
	}

	function getAthletes(req, res, next)
	{
				res.athletes = [ {
    'CONCAT(`ath`.`firstname`, " ", SUBSTR(`ath`.`lastname`,1,1))': 'Simon B',
    country: 'United Kingdom',
    'COUNT(`act`.`id`)': 8,
    'ROUND(SUM(`act`.`distance`)/1000,1)': 184.9
  }
];
				next();
	}

	function getActivityTypes(req, res, next)
	{
			res.activity_types=[ 'Ride', 'VirtualRide' ];
		  next();
	};

	function updateActivities(activities)
	{
	}

	function updateAthlete(req,res,next)
	{
		next();
	};

module.exports = { getEvent, getActivityTypes, updateActivities, updateAthlete, getTotalDistance, getActivities, getAthletes};

