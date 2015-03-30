var home = require('../controllers/home');
var image = require('../controllers/image');
var users = require('../controllers/user');
var passport = require('passport');



module.exports.initialize = function(app, router) {
	app.get('/', home.index);
	app.get('/images/:image_id', image.index);
	
	app.post('/images', image.create);
	app.post('/images/:image_id/like', image.like);
	app.post('/images/:image_id/comment', image.comment );   	
	
	app.use('/', router);


	app.get('/signup', users.renderSignup);
	app.post('/signup', users.signup);
	app.route('/signin')
		.get(users.renderSignin)
		.post(passport.authenticate('local', {
			successRedirect: '/',
			failureRedirect: '/signin',
			failureFlash: true,
	          successFlash: 'Welcome!'
		}));
	app.get('/signout', users.signout);
};