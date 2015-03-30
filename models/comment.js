var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

//*****Create and export the Comment Schema
	var commentSchema = new Schema({
	   comment : { type: String },
	   name : { type: String },
	   email : { type: String },
	   imageID : { type: String },
	   timestamp : { type : Date, 'default': Date.now } 
	});

module.exports = mongoose.model('Comment', commentSchema);