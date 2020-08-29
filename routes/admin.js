var express = require('express');
var router = express.Router();
const aws = require('aws-sdk');
const S3_BUCKET = process.env.S3_BUCKET;
aws.config.region = 'eu-west-2';

router.get('/sign-s3', (req, res) => {
	const s3 = new aws.S3();
	const fileName = req.query['file-name'];
	const fileType = req.query['file-type'];
	const s3Params = {
		Bucket: S3_BUCKET,
		Key: fileName,
		Expires: 60,
		ContentType: fileType,
		ACL: 'public-read'
	};

	s3.getSignedUrl('putObject', s3Params, (err, data) => {
		if(err){
			console.log(err);
			return res.end();
		}
		const returnData = {
			signedRequest: data,
			url: `https://${S3_BUCKET}.s3.amazonaws.com/${fileName}`
		};
		res.write(JSON.stringify(returnData));
		console.log(JSON.stringify(returnData));
		res.end();
	});
});

router.post('/event',   
	function(req, res, next){
		req.app.locals.db.updateEvent(req, res, next);
	}, 
	function(req, res, next){
		req.app.locals.db.updateActivityTypes(req, res, next);
	}, 
	function(req, res, next){
		res.redirect('/admin/events');
	}
);

router.get('/event/:eventid',   
	function(req, res, next){
		req.event_id = req.params.eventid;
		req.app.locals.db.getEvent(req, res, next);
	}, 
	function(req, res, next){
		req.app.locals.db.getActivityTypes(req, res, next);
	}, 
	function(req, res, next){
		req.app.locals.db.getStages(req, res, next);
	}, 
	function(req, res, next){
		res.render('admin-event', { 
			pagename: 'admin-event',
			event: res.event,
			activity_types: res.activity_types,
			stage: res.stage,
			stages: res.stages,
			user: req.user,
			title: 'Admin: Event',
		});
	}
);

router.get('/stage/:stageid',   
	function(req, res, next){
		req.app.locals.db.getStage(req, res, next);
	}, 
	function(req, res, next){
		res.render('admin-stage', { 
			pagename: 'admin-stage',
			stage: res.stage,
			user: req.user,
			title: 'Admin: Stage',
		});
	}
);

router.post('/stage',   
	function(req, res, next){
		req.app.locals.db.updateStage(req, res, next);
	}, 
	function(req, res, next){
		res.redirect('/admin/event/' + req.body.eventid);
	}
);

router.get('/events',   
	function(req, res, next){
		req.app.locals.db.getEventList(req, res, next);
	}, 
	function(req, res, next){
		res.render('admin-eventlist', { 
			pagename: 'admin-eventlist',
			events: res.events,
			user: req.user,
			title: 'Admin: event list'
		});
	}
);

router.get('/teams',   
	function(req, res, next){
		req.app.locals.db.getTeamList(req, res, next);
	}, 
	function(req, res, next){
		res.render('admin-teamlist', { 
			pagename: 'admin-teamlist',
			teams: res.teams,
			user: req.user,
			title: 'Admin: team list'
		});
	}
);

router.get('/team/:teamid',   
	function(req, res, next){
		req.app.locals.db.getTeam(req, res, next);
	}, 
	function(req, res, next){
		res.render('admin-team', { 
			pagename: 'admin-team',
			team: res.team,
			user: req.user,
			title: 'Admin: Team',
		});
	}
);

router.post('/team',   
	function(req, res, next){
		req.app.locals.db.updateTeam(req, res, next);
	}, 
	function(req, res, next){
		res.redirect('/admin/teams');
	}
);

router.get('/charities',   
	function(req, res, next){
		req.app.locals.db.getCharityList(req, res, next);
	}, 
	function(req, res, next){
		res.render('admin-charitylist', { 
			pagename: 'admin-charitylist',
			charities: res.charities,
			user: req.user,
			title: 'Admin: charity list'
		});
	}
);

router.get('/charity/:charityid',   
	function(req, res, next){
		req.app.locals.db.getCharity(req, res, next);
	}, 
	function(req, res, next){
		res.render('admin-charity', { 
			pagename: 'admin-charity',
			charity: res.charity,
			user: req.user,
			title: 'Admin: Charity',
		});
	}
);

router.post('/charity',   
	function(req, res, next){
		req.app.locals.db.updateCharity(req, res, next);
	}, 
	function(req, res, next){
		res.redirect('/admin/charities');
	}
);

module.exports = router;
