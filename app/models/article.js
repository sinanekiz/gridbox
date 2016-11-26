'use strict';

/**
 * Module dependencies.
 */

const mongoose = require('mongoose');
const notify = require('../mailer');
const extend = require('mongoose-schema-extend');
var base = require('./base');

// const Imager = require('imager');
// const config = require('../../config');
// const imagerConfig = require(config.root + '/config/imager.js');

const Schema = mongoose.Schema;

const getTags = tags => tags.join(',');
const setTags = tags => tags.split(',');

/**
 * Article Schema
 */

const ArticleSchema = base.extend({
  title: { type: String, default: '', trim: true },
  body: { type: String, default: '', trim: true },
  user: {
    type: Schema.ObjectId, ref: 'User',
    hideTable: true
  },
  comments: {
    type: [{
      body: { type: String, default: '' },
      user: { type: Schema.ObjectId, ref: 'User' },
      createdAt: { type: Date, default: Date.now }
    }],
    hideTable: true
  },
  tags: { type: [], get: getTags, set: setTags },
  image: {
    type: {
      cdnUri: String,
      files: []
    }
    , trim: true,
    hideTable: true
  }
});

/**
 * Validations
 */

ArticleSchema.path('title').required(true, 'Article title cannot be blank');
ArticleSchema.path('body').required(true, 'Article body cannot be blank');

/**
 * Pre-remove hook
 */

ArticleSchema.pre('remove', function (next) {
  // const imager = new Imager(imagerConfig, 'S3');
  // const files = this.image.files;

  // if there are files associated with the item, remove from the cloud too
  // imager.remove(files, function (err) {
  //   if (err) return next(err);
  // }, 'article');

  next();
});

/**
 * Methods
 */
ArticleSchema.methods.assign = function () {
  
    return "title body tags";
  
}

ArticleSchema.methods.uploadAndSave= function (image) {
  const err = this.validateSync();
  if (err && err.toString()) throw new Error(err.toString());
  return this.save();

  /*
  if (images && !images.length) return this.save();
  const imager = new Imager(imagerConfig, 'S3');

  imager.upload(images, function (err, cdnUri, files) {
    if (err) return cb(err);
    if (files.length) {
      self.image = { cdnUri : cdnUri, files : files };
    }
    self.save(cb);
  }, 'article');
  */
},

/**
 * Add comment
 *
 * @param {User} user
 * @param {Object} comment
 * @api private
 */

ArticleSchema.methods.addComment= function (user, comment) {
  this.comments.push({
    body: comment.body,
    user: user._id
  });

  if (!this.user.email) this.user.email = 'email@product.com';

  notify.comment({
    article: this,
    currentUser: user,
    comment: comment.body
  });

  return this.save();
},

/**
 * Remove comment
 *
 * @param {commentId} String
 * @api private
 */

ArticleSchema.methods.removeComment= function (commentId) {
  const index = this.comments
    .map(comment => comment.id)
    .indexOf(commentId);

  if (~index) this.comments.splice(index, 1);
  else throw new Error('Comment not found');
  return this.save();
}


/**
 * Statics
 */

 

  /**
   * List articles
   *
   * @param {Object} options
   * @api private
   */

  ArticleSchema.statics.list = function (options) {
    const criteria = options.conditions || {};
    const page = options.page || 0;
    const limit = options.limit || 30;
    return this.find(criteria)
      .populate('user', 'name username')
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(limit * page)
      .exec();
  }


mongoose.model('Article', ArticleSchema);
