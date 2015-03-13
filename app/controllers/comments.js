'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Comment = mongoose.model('Comment'),
	_ = require('lodash');

/**
 * Get the error message from error object
 */
var getErrorMessage = function(err) {
	var message = '';
	if (err.code) {
		switch (err.code) {
			case 11000:
			case 11001:
				message = 'Comment already exists';
				break;
			default:
				message = 'Something went wrong';
		}
	} else {
		for (var errName in err.errors) {
			if (err.errors[errName].message) message = err.errors[errName].message;
		}
	}

	return message;
};

/**
 * Create a comment
 */
exports.create = function(req, res) {

	var comment = new Comment(req.body.comment);
	comment.user = req.user;

	comment.save(function(err) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
            Comment.findById(comment._id).populate('user', 'displayName').exec(function(err, comment1) {
                if (err) {
                    return res.send(400, {
                        message: getErrorMessage(err)
                    });
                } else {
                    res.jsonp(comment1);
                }
            });
		}
	});
};

/**
 * Show the current comment
 */
exports.read = function(req, res) {
	res.jsonp(req.comment);
};

/**
 * Update a comment
 */
exports.update = function(req, res) {
	var comment = req.comment;

	comment = _.extend(comment, req.body.comment);

	comment.save(function(err) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
            Comment.findById(comment._id).populate('user', 'displayName').exec(function(err, comment1) {
                if (err) {
                    return res.send(400, {
                        message: getErrorMessage(err)
                    });
                } else {
                    res.jsonp(comment1);
                }
            });
		}
	});
};

/**
 * Delete an comment
 */
exports.delete = function(req, res) {
	var comment = req.comment;

	comment.remove(function(err) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(comment);
		}
	});
};

/**
 * List of comments
 */
exports.list = function(req, res) {
	Comment.find().sort('created').populate('user', 'displayName').exec(function(err, comments) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(comments);
		}
	});
};

/**
 * Comment middleware
 */
exports.commentByID = function(req, res, next, id) {
	Comment.findById(id).populate('user', 'displayName').exec(function(err, comment) {
		if (err) return next(err);
		if (!comment) return next(new Error('Failed to load comment ' + id));
		req.comment = comment;
		next();
	});
};

/**
 * Comment authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.comment.user.id !== req.user.id) {
		return res.send(403, {
			message: 'User is not authorized'
		});
	}
	next();
};