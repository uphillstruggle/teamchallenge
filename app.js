var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var logger = require('morgan');
var db = require("./models/model-postgres");
var strava = require("./models/model-strava");

var indexRouter = require('./routes/index');
var leaderboardRouter = require('./routes/leaderboard');
var profileRouter = require('./routes/profile');
var authRouter = require('./routes/auth');
var webhookRouter = require('./routes/webhook');
var adminRouter = require('./routes/admin');


var passport = require('passport');
var stravaStrategy = require('passport-strava').Strategy;

passport.use(new stravaStrategy({
    clientID: process.env['STRAVA_CLIENT_ID'],
    clientSecret: process.env['STRAVA_CLIENT_SECRET'],
	scope: 'read,activity:read',
	approval_prompt: 'auto',
    callbackURL: '/auth/callback'
  },
	function(accessToken, refreshToken, profile, cb) {
		// store refresh and access token in profile 
		profile.accessToken=accessToken;
		profile.refreshToken=refreshToken;
		profile.tokenRefreshTime = Date.now();
		return cb(null, profile);
    }
  ));

passport.serializeUser(function(user, cb) {
  cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});

var app = express();

// add models to app
app.locals.db = db;
app.locals.strava = strava;

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));

var session = require("express-session");
var session_store = new (require('connect-pg-simple')(session))
		({ 
			tableName: db.getSessionTable(),
			schemaName: db.getSessionSchema(),
			conString: process.env['DATABASE_URL']
		});

app.use(session({
	store: session_store,
	secret: process.env['SESSION_SECRET'],
	resave: false,
	saveUninitialized: false,
	cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 } // 30 days
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(bodyParser.json({strict: false}));
app.use('/admin', adminRouter); 
app.use('/leaderboard', leaderboardRouter); 
app.use('/profile', profileRouter); 
app.use('/auth', authRouter); 
app.use('/webhook', webhookRouter); 
app.use('/', indexRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

