'use strict';

module.exports = {
    app: {
        title: 'BrightBI',
        description: 'A business intelligence tool to analyze enterprise data and to share reports anytime anywhere on any devices.',
        keywords: 'business intelligence, data analysis, web pivot table, report'
    },
    port: process.env.PORT || 8002,
    templateEngine: 'swig',
    // The secret should be set to a non-guessable string that
    // is used to compute a session hash
    sessionSecret: 'BRIGHTBI',
    // The name of the MongoDB collection to store sessions in
    sessionCollection: 'sessions',
    // The session cookie settings
    sessionCookie: {
        path: '/',
        httpOnly: true,
        // If secure is set to true then it will cause the cookie to be set
        // only when SSL-enabled (HTTPS) is used, and otherwise it won't
        // set a cookie. 'true' is recommended yet it requires the above
        // mentioned pre-requisite.
        secure: false,
        // Only set the maxAge to null if the cookie shouldn't be expired
        // at all. The cookie will expunge when the browser is closed.
        maxAge: null,
        // To set the cookie in a specific domain uncomment the following
        // setting:
        // domain: 'yourdomain.com'
    },
    // The session cookie name
    sessionName: 'connect.sid',
    log: {
        // Can specify one of 'combined', 'common', 'dev', 'short', 'tiny'
        format: 'combined',
        // Stream defaults to process.stdout
        // Uncomment to enable logging to a log on the file system
        options: {
            stream: 'access.log'
        }
    },
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
                'public/lib/filepicker/index.js',
                'public/lib/jquery/dist/jquery.min.js',
                'public/lib/highcharts-release/highcharts-all.js',
                'public/lib/grouped_categories/grouped_categories.js',

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
                'public/lib/angular-bootstrap/ui-bootstrap-tpls.min.js'
            ]
        },
        css: 'public/dist/application.min.css',
        js: 'public/dist/application.min.js'
    },
    wptSetting:{
        cssFile: '/brightsea/wpt/wpt.css',
        jsfile: '/brightsea/wpt/wpt.js',

        dojoConfig: {
            async:1, 
            baseUrl: '/brightsea/dojo/',
            packages: [{
                name: 'wpt', location: '../wpt'
            }]
        },    
        options: {
            leavePageWarning: 1,

            uiFlags: {
                newWptBtn: 1,
                openWptBtn: 1,
                saveWptBtn: 1,
                switchViewBtn: 1,
                navPaneBtn: 1,
                settingBtn: 1,
                languageSwitchBtn: 1, // show/hide 'Language Switch' dropdown button: 1/0
                helpBtn: 1, // show/hide 'Help' button: 1/0
                aboutBtn: 1, // show/hide 'About' button: 1/0

                memoryTab: 1,
                olapTab: 1,
                internetLinkTab: 1,
                cloudDriveBtn: 1,
                localDriveTab: 1,
                googleSpreadSheetTab: 1,
                copyPasteTab: 1,

                zoomBtn: 1,
                fullScreenBtn: 1,
                exportExcelBtn: 1
            },

            fileLinks:[],

            filepicker:{
                key: ''
            },

            decimalPoint: '.',  // decimal point charactor: '.', ','
            thousandsSep: ',', // thousands separator: ',' '.', ' '
            zoomScaleStep: 0.05,
            reportCssFile: '/brightsea/wpt/wptReport.css',

            olap:{
                drillThroughMaxRows: 1000,
                sync : 0,
                timeout : 300000,
                xmlaProxyEnabled: 1,        // enable/disable Xmla Proxy 1/0
                xmlaProxy: '/wpt/xmlaProxy'
            },

            exporting: {
                pdf: {
                    paperMarginTop: '1cm',
                    paperMarginLeft: '1cm',
                    paperMarginBottom: '1cm',
                    paperMarginRight: '1cm',
                    paperFormat: 'A4', //'A3', 'A4', 'A5', 'Legal', 'Letter', 'Tabloid'. 'Custom'
                    paperOrientation: 'portrait',  //'portrait', 'landscape'
                    paperWidth: '600px',
                    paperHeight: '600px',
                    headerHeight: '1cm',
                    header: '',
                    footerHeight: '1cm',
                    footer: '',
                    zoomFactor: 1
                }
            }

        }
    },
    db: {
        uri: process.env.MONGOHQ_URL || process.env.MONGOLAB_URI || 'mongodb://' + (process.env.DB_1_PORT_27017_TCP_ADDR || 'localhost') + '/mean',
        options: {
            user: '',
            pass: ''
        }
    },
    facebook: {
        clientID: process.env.FACEBOOK_ID || 'APP_ID',
        clientSecret: process.env.FACEBOOK_SECRET || 'APP_SECRET',
        callbackURL: '/auth/facebook/callback'
    },
    twitter: {
        clientID: process.env.TWITTER_KEY || 'CONSUMER_KEY',
        clientSecret: process.env.TWITTER_SECRET || 'CONSUMER_SECRET',
        callbackURL: '/auth/twitter/callback'
    },
    google: {
        clientID: process.env.GOOGLE_ID || 'APP_ID',
        clientSecret: process.env.GOOGLE_SECRET || 'APP_SECRET',
        callbackURL: '/auth/google/callback'
    },
    linkedin: {
        clientID: process.env.LINKEDIN_ID || 'APP_ID',
        clientSecret: process.env.LINKEDIN_SECRET || 'APP_SECRET',
        callbackURL: '/auth/linkedin/callback'
    },
    github: {
        clientID: process.env.GITHUB_ID || 'APP_ID',
        clientSecret: process.env.GITHUB_SECRET || 'APP_SECRET',
        callbackURL: '/auth/github/callback'
    },
    mailer: {
        from: process.env.MAILER_FROM || 'noreply@webpivottable.com',
        options: {
            //service: process.env.MAILER_SERVICE_PROVIDER || 'MAILER_SERVICE_PROVIDER',
            //auth: {
            //	user: process.env.MAILER_EMAIL_ID || 'MAILER_EMAIL_ID',
            //	pass: process.env.MAILER_PASSWORD || 'MAILER_PASSWORD'
            //}
        }
    }
};

