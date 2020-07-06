var express = require('express');
var passport = require('passport');
var session = require('express-session');
var router = express.Router();
	
function checkSignIn(req, res, next){
   if(req.session.passport && req.session.passport.user){
      next();
   } else {
	console.log("checkSignIn failed", req.session);
	   res.redirect("/auth/login");
   }
}

router.get('/', checkSignIn, function(req, res){
	res.render('leaderboard', { user : req.session.passport.user });
});

module.exports = router;
