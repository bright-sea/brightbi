'use strict';

module.exports = {
	app: {
		title: 'Bright BI',
		description: 'A BI solution leverage WebPivotTable component to analyze data dynamically and to share reports within enterprise.',
		keywords: 'business intelligence, data analysis, web pivot table, report'
	},
	port: process.env.PORT || 8001,
	templateEngine: 'swig',
	sessionSecret: 'BRIGHTBI',
	sessionCollection: 'sessions',
	assets: {
		lib: {
			css: [
				'public/lib/bootstrap/dist/css/bootstrap.css',
				'public/lib/bootstrap/dist/css/bootstrap-theme.css',
                'public/lib/angular-grid/ng-grid.css',
                'public/lib/angular-bootstrap-nav-tree/dist/abn_tree.css',
                'public/lib/fontawesome/css/font-awesome.css'
			],
			js: [
				'public/lib/ng-file-upload/angular-file-upload-shim.js',
				'public/lib/angular/angular.js',
				'public/lib/ng-file-upload/angular-file-upload.js',
				'public/lib/angular-resource/angular-resource.js',
				'public/lib/angular-animate/angular-animate.js',
				'public/lib/angular-messages/angular-messages.js',
				'public/lib/angular-ui-router/release/angular-ui-router.js',
				'public/lib/angular-ui-utils/ui-utils.js',
                'public/lib/angular-grid/build/ng-grid.js',
                'public/lib/angular-bootstrap-nav-tree/dist/abn_tree_directive.js',
                'public/lib/angular-translate/angular-translate.js',
				'public/lib/angular-bootstrap/ui-bootstrap-tpls.js',
				'public/lib/js-xls/dist/xls.core.min.js',
				'public/lib/js-xlsx/dist/xlsx.core.min.js',
				'public/lib/Blob/Blob.js',
				'public/lib/FileSaver/FileSaver.js'
			]
		},
		css: [
			'public/modules/**/css/*.css'
		],
		js: [
			'public/config.js',
			'public/application.js',
			'public/modules/*/*.js',
			'public/modules/*/*[!tests]*/*.js'
		],
		tests: [
			'public/lib/angular-mocks/angular-mocks.js',
			'public/modules/*/tests/*.js'
		]
	}
};