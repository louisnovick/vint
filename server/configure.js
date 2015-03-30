var path = require('path');
var routes = require('./routes');
var exphbs = require('express-handlebars');
var express = require('express');
var session = require('express-session');	
var bodyParser = require('body-parser');
var multer = require('multer');
var cookieParser = require('cookie-parser');
var morgan = require('morgan');
var methodOverride = require('method-override');
var errorHandler = require('errorhandler');
var moment = require('moment');
// passport
var passport = require('passport');
var flash = require('connect-flash');


module.exports = function(app) {
	app.engine('handlebars', exphbs.create({
		defaultLayout: 'main',
		layoutsDir: app.get('views') + '/layouts',
		partialsDir: [app.get('views') + '/partials'],
		helpers: {
			timeago: function(timestamp) {
				return moment(timestamp).startOf('minute').fromNow();
			}
		}
	}).engine);
	app.set('view engine', 'handlebars');

	app.use(session({ secret: '123', 
	             saveUninitialized: true,
	             resave: true }));
	app.use(passport.initialize());
	app.use(passport.session());
	app.use(flash());


	app.use(morgan('dev'));
	//handles data and json
	app.use(multer({ dest: './uploads/' }));
	// app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({extended:true}));
	//handles older browsers that can't support REST
	app.use(methodOverride());
	//cookies
	app.use(cookieParser('secret-value'));
	//lets us respond to get/post/put/update
	
	//allows us to serve static files
	app.use('/public', express.static(path.join(__dirname, '../public')));
	routes.initialize(app, new express.Router());
	//uses a default error handler when we're in a development environment
	if ('development' === app.get('env')) {
		app.use(errorHandler());
	}
	
	return app;
};