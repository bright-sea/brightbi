'use strict';

module.exports = {
	db: process.env.MONGOHQ_URL || process.env.MONGOLAB_URI || 'mongodb://localhost/brightbi',
	assets: {
		lib: {
			css: [
				'public/lib/bootstrap/dist/css/bootstrap.min.css',
				'public/lib/bootstrap/dist/css/bootstrap-theme.min.css',
                'public/lib/angular-grid/ng-grid.min.css',
                'public/lib/angular-bootstrap-nav-tree/dist/abn_tree.css',
                'public/lib/fontawesome/css/font-awesome.min.css'
			],
			js: [
				'public/lib/ng-file-upload/angular-file-upload-shim.min.js',
				'public/lib/angular/angular.min.js',
				'public/lib/ng-file-upload/angular-file-upload.min.js',
				'public/lib/angular-resource/angular-resource.min.js',
				'public/lib/angular-animate/angular-animate.min.js',
				'public/lib/angular-messages/angular-messages.min.js',
				'public/lib/angular-ui-router/release/angular-ui-router.min.js',
				'public/lib/angular-ui-utils/ui-utils.min.js',
                'public/lib/angular-grid/build/ng-grid.min.js',
                'public/lib/angular-bootstrap-nav-tree/dist/abn_tree_directive.js',
                'public/lib/angular-translate/angular-translate.min.js',
				'public/lib/angular-bootstrap/ui-bootstrap-tpls.min.js',
				'public/lib/js-xls/dist/xls.core.min.js',
				'public/lib/js-xlsx/dist/xlsx.core.min.js',
				'public/lib/Blob/Blob.js',
				'public/lib/FileSaver/FileSaver.min.js'
			]
		},
		css: 'public/dist/application.min.css',
		js: 'public/dist/application.min.js'
	},
	facebook: {
		clientID: process.env.FACEBOOK_ID || 'APP_ID',
		clientSecret: process.env.FACEBOOK_SECRET || 'APP_SECRET',
		callbackURL: 'http://localhost:3000/auth/facebook/callback'
	},
	twitter: {
		clientID: process.env.TWITTER_KEY || 'CONSUMER_KEY',
		clientSecret: process.env.TWITTER_SECRET || 'CONSUMER_SECRET',
		callbackURL: 'http://localhost:3000/auth/twitter/callback'
	},
	google: {
		clientID: process.env.GOOGLE_ID || 'APP_ID',
		clientSecret: process.env.GOOGLE_SECRET || 'APP_SECRET',
		callbackURL: 'http://localhost:3000/auth/google/callback'
	},
	linkedin: {
		clientID: process.env.LINKEDIN_ID || 'APP_ID',
		clientSecret: process.env.LINKEDIN_SECRET || 'APP_SECRET',
		callbackURL: 'http://localhost:3000/auth/linkedin/callback'
    },
    filepicker: {
        key: ''
	}
};