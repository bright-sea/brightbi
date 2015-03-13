'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Comment Schema
 */
var CommentSchema = new Schema({
	commentableType: {
		type: String,
		default: '',
		trim: true,
		required: 'Description cannot be blank'
	},
    commentableId: {
        type :  Schema.ObjectId
    },
    parentId: {
        type : Schema.ObjectId
    },
	body: {
		type: String,
		default: '',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	updated: {
		type: Date
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Comment', CommentSchema);