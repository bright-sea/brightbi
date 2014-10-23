'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Wpt Schema
 */
var WptSchema = new Schema({
	created: {
		type: Date,
		default: Date.now
	},
	title: {
		type: String,
		default: '',
		trim: true,
		required: 'Title cannot be blank'
	},
	description: {
		type: String,
		default: '',
		trim: true,
		required: 'Description cannot be blank'
	},
    sourceFileId: {
        type :  Schema.ObjectId
    },
    reportFileId: {
        type : Schema.ObjectId
    },
	content: {
		type: String,
		default: '',
		trim: true
	},
	archived: {
		type: Boolean	
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Wpt', WptSchema);