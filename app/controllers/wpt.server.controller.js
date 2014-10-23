'use strict';

/**
 * Module dependencies.
 */
var fs = require('fs'),
    Stream = require('stream'),
    request = require('request'),
    childProcess = require('child_process'),
    crypto = require('crypto'),
    path = require('path'),
    Busboy = require('busboy'),
    mongoose = require('mongoose'),
    Wpt = mongoose.model('Wpt'),
    Grid = require('gridfs-stream'),
    nodemailer = require('nodemailer'),
    phantomjs = require('phantomjs'),
    binPath = phantomjs.path;

Grid.mongo = mongoose.mongo;
var gfs;

var conn = mongoose.createConnection(require('../../config/config').db);
conn.once('open', function () {
    gfs = new Grid(conn.db);

    // all set!
});


var getReturnError = function(err) {
    var returnError = {
        errorId: 'ERROR_SERVER_GENERAL',
        errors: []
    };

    if (err.code) {
        switch (err.code) {
            case 11000:
            case 11001:
                returnError.errorId = 'ERROR_USERNAME_DUPLICATE';
                break;
            default:
                returnError.errors.push('Something went wrong');
        }
    } else {
        for (var errName in err.errors) {
            if (err.errors[errName].message) {
                returnError.errors.push(err.errors[errName].message);
            }
        }
    }

    return returnError;
};



exports.xmlaProxy = function ( req,res ) {

    req.pipe(request(req.get('xmlaUrl'))).pipe(res);
};

exports.fileProxy = function ( req,res ) {
    request.get(req.get('fileUrl')).pipe(res);
};


exports.generatePdf = function ( req,res ) {

    var fileName = 'report'+crypto.randomBytes(4).readUInt32LE(0),
        htmlFile = __dirname+'/../../public/report/'+fileName+'.html',
        pdfFile  = __dirname+'/../../public/report/'+fileName+'.pdf';

    // Save to HTML file
    fs.writeFile(htmlFile, req.body.html, function(err) {
        if (err) {
            throw err;
        }

        var childArgs = [
            path.join(__dirname, 'generate_pdf.js'),
            htmlFile,
            pdfFile
        ];

        childProcess.execFile(binPath, childArgs, function(err, stdout, stderr) {
            if (err) {
                throw err;
            }
            res.writeHead(200, {
                'Content-Type': 'text/plain'
            });
            res.end('{"file":"/report/'+fileName+'.pdf"}');
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

    var writestream = gfs.createWriteStream({
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
                return res.send(400, getReturnError(err));
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

