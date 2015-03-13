'use strict';

/**
 * Module dependencies.
 */
var fs = require('fs'),
    Stream = require('stream'),
    request = require('request'),
    crypto = require('crypto'),
    path = require('path'),
    Busboy = require('busboy'),
	config = require('../config'),
    mongoose = require('mongoose'),
	errorHandler = require('./errors'),
    Wpt = mongoose.model('Wpt'),
    nodemailer = require('nodemailer'),
    temp = require('temp').track(),
    phantomjs = require('phantomjs'),
    phantom = require('phantom');


exports.xmlaProxy = function ( req,res ) {
    req.pipe(request(req.get('xmlaUrl'))).pipe(res);
};

exports.fileProxy = function ( req,res ) {
    request.get(req.get('fileUrl')).pipe(res);
};

exports.generatePdf = function ( req,res ) {

    var type = req.body.type,
        options = req.body.options? JSON.parse(req.body.options) : {},
        html = req.body.html;

    phantom.create({
        //port: 12345,
        binary: phantomjs.path
    },function (ph) {
        ph.createPage(function (page) {
            page.settings = {
                loadImages: true,
                localToRemoteUrlAccessEnabled: true,
                javascriptEnabled: true,
                loadPlugins: false
//                    userAgent: 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/37.0.2062.120 Safari/537.36'
            };
            //page.set('viewportSize', { width: 800, height: 600 });
            //page.set('scrollPosition',{top: 100, left: 0});

            var paperSize = {
                margin: {
                    top: options.paperMarginTop || '1cm',
                    left: options.paperMarginLeft || '1cm',
                    bottom: options.paperMarginBottom || '1cm',
                    right: options.paperMarginRight || '1cm'
                },
                header: {
                    height: options.headerHeight || '1cm',
                    contents: ph.callback(function(pageNum, numPages) {
                        return '';
                        //                       return '<h1>test header <span style="float:right">' + pageNum + ' / ' + numPages + '</span></h1>';
                    })
                },
                footer: {
                    height: options.footerHeight || '1cm',
                    contents: ph.callback(function(pageNum, numPages) {
//                        return '<h1>'+(options.footer || 'test footer')+' <span style="float:right">' + pageNum + ' / ' + numPages + '</span></h1>';
                        return '<span style="float:right">' + pageNum + ' / ' + numPages + '</span>';
                    })
                }
            };

            if (/Custom/i.test(options.paperFormat)){
                paperSize.width =  options.paperWidth || '600px';   // 'mm', 'cm', 'in', 'px'. No unit means 'px'.
                paperSize.height = options.paperHeight || '600px';
            }else{
                paperSize.format = options.paperFormat || 'A4';   //'A3', 'A4', 'A5', 'Legal', 'Letter', 'Tabloid'.
                paperSize.orientation = options.paperOrientation || 'portrait';  //'portrait', 'landscape'
            }
            page.set('paperSize', paperSize);
            page.set('zoomFactor', options.zoomFactor || 1);

            page.set('content', html, function (error) {

                temp.open('report', function(err, info) {
                    if (!err) {
                        page.render(info.path, {
                            format: type,
                            quality: '100'
                        }, function (error) {
                            var readStream = fs.createReadStream(info.path);
                            readStream.pipe(res);
                            readStream.on('close', function(){
                                temp.cleanup();
                            });
                        });
                        ph.exit();
                    }
                });
            });
        });
    });
};

exports.uploadFile = function(req, res) {

    var busboy = new Busboy({ headers: req.headers });

    var fileType = req.headers.filetype; //pay attention 'filetype' are all lowercase

    try{

        busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {

            if (fileType === 'xls' || fileType === 'xlsx') {
                file.setEncoding('base64');
            }
            var content = '';

            file.on('data', function(data) {
                content += data;
            });
            file.on('end', function() {
                res.write(content);
                res.end();
            });
        });

        req.pipe(busboy);

    }catch(err){
        res.send(400, {
            errorId: 'ERROR_UPLOAD_FILE',
            errors: [err]
        });
    }
};


exports.getDataByFileUrl = function(req, res) {

    var fileType = req.body.fileType;  //pay attention 'fileType' is camelcase

    if (fileType === 'xls' || fileType === 'xlsx') {
        request({
                url: req.body.fileUrl,
                method: 'GET',
                encoding: 'base64'
            },
            function (err, response, file) {
                if (err){
                    res.send(400, {
                        errorId: 'ERROR_REQUEST_FILE_URL',
                        errors: [err]
                    });
                }else{
                    res.write(file);
                    res.end();
                }
            }
        );
    }else{
        try {
            request.get(req.body.fileUrl).pipe(res);
        }catch(err){
            res.send(400, {
                errorId: 'ERROR_REQUEST_FILE_URL',
                errors: [err]
            });
        }
    }
};

exports.saveReport = function(req, res) {

    var stream = new Stream();

    var writestream = req.app.gfs.createWriteStream({
        filename: 'newwpt'
    });

    writestream.on('close', function (saveFile) {

        var wpt = new Wpt();

        wpt.title = req.body.title;
        wpt.description = req.body.description;
        wpt.reportFileId = saveFile._id;
        wpt.user = req.user;

        wpt.save(function(err) {
            if (err) {
                return res.send(400, errorHandler.getReturnError(err));
            } else {
                res.jsonp(wpt);
            }
        });

    });

    stream.on('data', function(data) {
        writestream.write(data);
        writestream.end();
    });

    stream.emit('data', req.body.wpt);

};




exports.shareReport = function(req, res) {

    var smtpTransport = nodemailer.createTransport();
    var mailOptions = {
        to: req.body.email,
        from: 'noreply@brightsea.ca',
        subject: req.body.user.displayName + ' shared a report to you.',
        text: 'Please click on the following link, or paste this into your browser to open the report:\n\n' +
            req.body.url + '\n\n'
    };
    smtpTransport.sendMail(mailOptions, function(err) {
        if (err){
            res.send(400, {errors: [err]});
        }else{
            res.send({});
        }
    });
};


