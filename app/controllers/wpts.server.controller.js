'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Wpt = mongoose.model('Wpt'),
	Comment = mongoose.model('Comment'),
    Busboy = require('busboy'),
    Grid = require('gridfs-stream'),
	_ = require('lodash');


Grid.mongo = mongoose.mongo;
var gfs;

var conn = mongoose.createConnection(require('../../config/config').db);
conn.once('open', function () {
    gfs = new Grid(conn.db);

    // all set!
});

/**
 * Get the error message from error object
 */
var getErrorMessage = function(err) {
	var message = '';

	if (err.code) {
		switch (err.code) {
			case 11000:
			case 11001:
				message = 'Wpt already exists';
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

exports.getComments = function(req, res) {

    Comment.find({
    	commentableType: 'wpt',
    	commentableId: req.query.wptId
    }).sort('created').populate('user', 'displayName').exec(function(err, comments) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(comments);
		}
	});
};



exports.readFile = function(req, res) {

    var readstream = gfs.createReadStream({
        _id: req.query.wptFileId
    });
    readstream.pipe(res);
};


/**
 * Create a wpt
 */
exports.create = function(req, res) {
	var wpt = new Wpt(req.body);
	wpt.user = req.user;

	wpt.save(function(err) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(wpt);
		}
	});
};

/**
 * Show the current wpt
 */
exports.read = function(req, res) {
	res.jsonp(req.wpt);
};

/**
 * Update a wpt
 */
exports.update = function(req, res) {
	var wpt = req.wpt;

	wpt = _.extend(wpt, req.body);

	wpt.save(function(err) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(wpt);
		}
	});
};

/**
 * Delete an wpt
 */
exports.delete = function(req, res) {
	var wpt = req.wpt;

    gfs.remove({_id:wpt.reportFileId}, function(err){
        if (err) return false;

        wpt.remove(function(err) {
            if (err) {
                return res.send(400, {
                    message: getErrorMessage(err)
                });
            } else {
                res.jsonp(wpt);
            }
        });

        return true;
    });

};

/**
 * List of Wpts
 */
exports.list = function(req, res) {
	Wpt.find().sort('-created').populate('user', 'displayName').exec(function(err, wpts) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(wpts);
		}
	});
};

/**
 * Wpt middleware
 */
exports.wptByID = function(req, res, next, id) {
	Wpt.findById(id).populate('user', 'displayName').exec(function(err, wpt) {
		if (err) return next(err);
		if (!wpt) return next(new Error('Failed to load wpt ' + id));
		req.wpt = wpt;
		next();
	});
};

/**
 * Wpt authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.wpt.user.id !== req.user.id) {
		return res.send(403, {
			message: 'User is not authorized'
		});
	}
	next();
};