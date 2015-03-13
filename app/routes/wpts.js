'use strict';

/**
 * Module dependencies.
 */
var users = require('../controllers/users'),
    wpts = require('../controllers/wpts');

module.exports = function(app) {
	
	// Wpt Routes
	app.route('/wpts')
		.get(wpts.list)
		.post(users.requiresLogin, wpts.create);

	app.route('/wpts/comments').get(wpts.getComments);

	app.route('/wpts/:wptId')
		.get(wpts.read)
		.put(users.requiresLogin, wpts.hasAuthorization, wpts.update)
		.delete(users.requiresLogin, wpts.hasAuthorization, wpts.delete);

    app.route('/wptfiles')
        .get(wpts.readFile);


    // Finish by binding the wpt middleware
	app.param('wptId', wpts.wptByID);
};