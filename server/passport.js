var passport = require('passport');
var mongoose = require('mongoose');
var user = require('../models/user');

module.exports = function() {
    var User = mongoose.model('User');
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });
    passport.deserializeUser(function(id, done) {
        user.findOne({
            _id: id
            }, '-password -salt', function(err, user) {
                done(err, user);
            });
        });
        require('./.strategies/local.js')();
    };
