var fs = require('fs');
var path = require('path');
var Models = require('../models');											
var stats = require('../helpers/stats');	

module.exports = {
	index: function(req, res) {
		var viewModel = {
			image: {},		
			comments: {},	
			sidebar: {},		
			userName: req.user ? req.user.username : ""
		};

		Models.Image.findOne({ filename: { $regex: req.params.image_id } },
			function (err, image) {
				if (err) { throw err; }
				if (image) {
					image.views++;
					viewModel.image = image;
					image.save(function(err) {
						if (err) {throw err};
					});
					Models.Comment.find({ imageID: {$regex: req.params.image_id } }, function(err, comments) {
						if (err) {throw err;};	
						viewModel.comments = comments;	
						stats(viewModel, function(viewModel) {
			            res.render('image', viewModel);
		                });
					});
				} else {
					res.redirect('/');
				}
			});
		},
	create: function(req, res) {
		var saveImage = function() {
			var possible = 'abcdefghijklmnopqrstuvwxyz0123456789',
                imgUrl = '';
            for(var i=0; i < 6; i+=1) {
                imgUrl += possible.charAt(Math.floor(Math.random() * possible.length));
            }
			Models.Image.find({ filename: imgUrl }, function(err, images) {
				if (images.length > 0) {
					saveImage();
				} else {
					var tempPath = req.files.file.path,
						ext = path.extname(req.files.file.name).toLowerCase(),
						targetPath = path.resolve('./public/upload/' + imgUrl + ext);
					if (ext === '.png' || ext === '.jpg' || ext === '.jpeg' || ext === '.gif') {
						fs.rename(tempPath, targetPath, function(err) { 
							if (err) { 
								throw err; 
							}
							var newImg = new Models.Image({
								title: req.body.title,
								filename: imgUrl + ext,
								description: req.body.description
							});
							newImg.save(function(err, image) {
								console.log('Successfully inserted image: ' + image.filename);
								res.redirect('/images/' + imgUrl);
							});
					});
					} else {
						fs.unlink(tempPath, function () {
							if (err) {
								throw err;
							}
							res.json(500, {error: 'Only image files are allowed.'});
						});
					}
				}
			});
		};	
		saveImage();
	},
	like: function(req, res) {
			Models.Image.findOne({ filename: { $regex: req.params.image_id } }, function(err, image ) {	
				image.likes++;		
				image.views--;		
				image.save(function(err, image){	
					if (err) {
						throw err;
					};
				});	
				res.redirect('/images/' + req.params.image_id);	
			})	
	},
	comment: function(req, res) {
		var newComment = new Models.Comment({						
			name: req.user.username,	
			email: req.user.email,
			comment: req.body.comment,
			imageID: req.params.image_id	
		});
		newComment.save(function(err, comment) {
			if (err) { throw err; console.log(err);};
			res.redirect('/images/' + req.params.image_id);
		});
	}
};