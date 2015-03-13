'use strict';

/**
 * Module dependencies.
 */
var users = require('../controllers/users'),
    webpivottable = require('../controllers/webpivottable');

module.exports = function(app) {
	
	// Wpt Routes
	app.route('/webpivottable').get(webpivottable.webpivottable);

};