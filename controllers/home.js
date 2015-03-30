//takes the browser's request and lets us send back a page or other information
var imageModel = require('../models').Image;
var stats = require('../helpers/stats');

module.exports = {
    index: function(req, res) {
        var viewModel = {
            images: {},
            sidebar: {},
            userName: req.user ? req.user.username : ""
        };
        imageModel.find(function(err, images) {
            viewModel.images = images;
            stats(viewModel, function(viewModel) {
                res.render('index',viewModel);
            });
        });
    }
};
