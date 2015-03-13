'use strict';

/**
 * Module dependencies.
 */

var mongoose = require('mongoose'),
    Wpt = mongoose.model('Wpt');


exports.webpivottable = function(req, res) {
    
	var wptId = req.query.id;

    var wptObject = null;

    if (wptId){
        Wpt.findById(wptId).populate('user', 'displayName').exec(function(err, wpt) {
            if (!err && wpt){
                res.render('webpivottable', {
                    user: req.user || null,
                    wpt: wpt || null,
                    request: req
                });
            }else{
                res.render('webpivottable', {
                    user: req.user || null,
                    request: req
                });
            }
        });
    }else{
        res.render('webpivottable', {
            user: req.user || null,
            request: req
        });
    }

};

