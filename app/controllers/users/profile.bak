'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
	errorHandler = require('../errors'),
	mongoose = require('mongoose'),
	passport = require('passport'),
	User = mongoose.model('User');

/**
 * Update user details
 */
exports.update = function(req, res) {
	// Init Variables
	var user = req.user;

	// For security measurement we remove the roles from the req.body object
	delete req.body.roles;

	if (user) {
		// Merge existing user
		user = _.extend(user, req.body);
		user.updated = Date.now();
		user.displayName = user.firstName + ' ' + user.lastName;

		user.save(function(err) {
			if (err) {
				return res.status(400).send(errorHandler.getReturnError(err));
			} else {
				req.login(user, function(err) {
					if (err) {
                        res.status(400).send([err]);
					} else {
						res.jsonp(user);
					}
				});
			}
		});
	} else {
		res.status(400).send([{errorId: 'ERROR_USER_NOT_SIGNIN'}]);
	}
};    
    

/**
 * Send User
 */
exports.me = function(req, res) {
	res.json(req.user || null);
};