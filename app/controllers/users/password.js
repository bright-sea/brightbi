'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
	errorHandler = require('../errors'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	config = require('../../config'),
	nodemailer = require('nodemailer'),
	async = require('async'),
	crypto = require('crypto');
	
//var smtpTransport = nodemailer.createTransport(config.mailer.options);
var smtpTransport = nodemailer.createTransport();

/**
 * Forgot for reset password (forgot POST)
 */
exports.forgot = function(req, res, next) {
	async.waterfall([
		// Generate random token
		function(done) {
			crypto.randomBytes(20, function(err, buffer) {
				var token = buffer.toString('hex');
				done(err, token);
			});
		},
        function(token, done) {
            User.findOne({ email: req.body.email }, function(err, user) {
            	if (err){
                    return res.status(400).send({errors:[err]});
            	}
                if (!user) {
                    return res.status(400).send({errorId:'ERROR_NO_USER_WITH_THIS_EMAIL'});
                }

                user.resetPasswordToken = token;
                user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

                user.save(function(err) {
                    done(err, token, user);
                });
            });
        },
        //function(token, user, done) {
        //    res.render('templates/reset-password-email', {
        //        name: user.displayName,
        //        appName: config.app.title,
        //        url: 'http://' + req.headers.host + '/auth/reset/' + token
        //    }, function(err, emailHTML) {
        //        done(err, emailHTML, user);
        //    });
        //},
        //// If valid email, send reset email using service
        //function(emailHTML, user, done) {
        //    var mailOptions = {
        //        to: user.email,
        //        from: config.mailer.from,
        //        subject: 'Password Reset',
        //        html: emailHTML
        //    };
        //    smtpTransport.sendMail(mailOptions, function(err) {
        //        if (!err) {
        //            res.send({
        //                message: 'An email has been sent to ' + user.email + ' with further instructions.'
        //            });
        //        } else {
        //            return res.status(400).send({
        //                message: 'Failure sending email'
        //            });
        //        }
        //
        //        done(err);
        //    });
        //}

        function(token, user, done) {
            var mailOptions = {
                to: user.email,
                from: config.mailer.from,
                subject: 'Bright BI Password Reset',
                text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
                'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
                'http://' + req.headers.host + '/#!/reset/' + token + '\n\n' +
                'If you did not request this, please ignore this email and your password will remain unchanged.\n'
            };
            smtpTransport.sendMail(mailOptions, function(err) {
                done(err, 'done');
            });
        }
    ], function(err) {
        if (err){
            res.status(400).send({errors:[err]});
        }else{
            res.send({});
        }
    });
};



/**
 * Reset password GET from email token
 */
exports.validateResetToken = function(req, res) {

	User.findOne({
		resetPasswordToken: req.params.token,
		resetPasswordExpires: {
			$gt: Date.now()
		}
	}, function(err, user) {
        if (err || !user) {
            return res.status(400).send({errorId:'ERROR_RESET_TOKEN_INVALID'});
        }
        res.jsonp(user);
	});
};


/**
 * Reset password POST from email token
 */
exports.reset = function(req, res, next) {
	// Init Variables
	var passwordDetails = req.body;

	async.waterfall([

		function(done) {
			User.findOne({
				resetPasswordToken: req.params.token,
				resetPasswordExpires: {
					$gt: Date.now()
				}
			}, function(err, user) {
            	if (err){
                    return res.status(400).send({errors:[err]});
            	}
                if (!user) {
                    return res.status(400).send({errorId:'ERROR_RESET_TOKEN_INVALID'});
                }
				if (!err && user) {
					if (passwordDetails.newPassword === passwordDetails.verifyPassword) {
						user.password = passwordDetails.newPassword;
						user.resetPasswordToken = undefined;
						user.resetPasswordExpires = undefined;

						user.save(function(err) {
							if (err) {
								return res.status(400).send(errorHandler.getReturnError(err));
							} else {
								req.login(user, function(err) {
									if (err) {
										res.status(400).send({errors:[err]});
									} else {
										// Return authenticated user 
										res.jsonp(user);
										done(err, user);
									}
								});
							}
						});
					} else {
						return res.status(400).send({
							message: 'Passwords do not match'
						});
					}
				}
			});
		},
        //function(user, done) {
        //    res.render('templates/reset-password-confirm-email', {
        //        name: user.displayName,
        //        appName: config.app.title
        //    }, function(err, emailHTML) {
        //        done(err, emailHTML, user);
        //    });
        //},
        //// If valid email, send reset email using service
        //function(emailHTML, user, done) {
        //    var mailOptions = {
        //        to: user.email,
        //        from: config.mailer.from,
        //        subject: 'Your password has been changed',
        //        html: emailHTML
        //    };
        //
        //    smtpTransport.sendMail(mailOptions, function(err) {
        //        done(err, 'done');
        //    });
        //}

        function(user, done) {
            var mailOptions = {
                to: user.email,
                from: config.mailer.from,
                subject: 'Your password has been changed',
                text: 'Hello,\n\n' +
                'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
            };
            smtpTransport.sendMail(mailOptions, function(err) {
                done(err);
            });
        }
    ], function(err) {
        if (err){
            res.send(400, {errors:[err]});
        }
    });
};

/**
 * Change Password
 */
exports.changePassword = function(req, res) {
	// Init Variables
	var passwordDetails = req.body;

	if (req.user) {
		if (passwordDetails.newPassword) {
			User.findById(req.user.id, function(err, user) {
				if (!err && user) {
					if (user.authenticate(passwordDetails.currentPassword)) {
						if (passwordDetails.newPassword === passwordDetails.verifyPassword) {
							user.password = passwordDetails.newPassword;

							user.save(function(err) {
								if (err) {
									return res.status(400).send(errorHandler.getReturnError(err));
								} else {
									req.login(user, function(err) {
										if (err) {
                                            res.send(400, {errors:[err]});
										} else {
											res.send({});
										}
									});
								}
							});
						} else {
							res.status(400).send({errorId: 'ERROR_CONFIRM_PASSWORD'});
						}
					} else {
						res.status(400).send({errorId: 'ERROR_CURRENT_PASSWORD'});
					}
				} else {
					res.status(400).send({errorId: 'ERROR_USER_NOT_FOUND'});
				}
			});
		} else {
			res.status(400).send({errorId: 'ERROR_NEW_PASSWORD'});
		}
	} else {
        res.status(400).send({errorId: 'ERROR_USER_NOT_SIGNIN'});
	}
};