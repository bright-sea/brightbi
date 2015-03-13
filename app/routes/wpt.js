'use strict';

/**
 * Module dependencies.
 */
var wpt = require('../controllers/wpt');

module.exports = function(app) {
    
	// Wpt Routes
    app.route('/wpt/fileProxy').post(wpt.fileProxy);
    app.route('/wpt/xmlaProxy').post(wpt.xmlaProxy);
    app.route('/wpt/generatePdf').post(wpt.generatePdf);
    app.route('/wpt/uploadFile').post(wpt.uploadFile);
    app.route('/wpt/getDataByFileUrl').post(wpt.getDataByFileUrl);
    app.route('/wpt/saveReport').post(wpt.saveReport);
    app.route('/wpt/shareReport').post(wpt.shareReport);


};