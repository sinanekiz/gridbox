'use strict';

/**
 * Module dependencies.
 */

const mongoose = require('mongoose');
const crypto = require('crypto');
const extend = require('mongoose-schema-extend');
var base = require('./base');

const Schema = mongoose.Schema;
const oAuthTypes = [
  'github',
  'twitter',
  'facebook',
  'google',
  'linkedin'
];

/**
 * User Schema
 */

const UserSchema = base.extend({
  name: { type: String, default: '' },
  email: { type: String, default: '' },
  username: { type: String, default: '' },
  provider: { type: String, default: '' },
  hashed_password: { type: String, default: '', hideTable: true },
  salt: { type: String, default: '', hideTable: true },
  authToken: { type: String, default: '', hideTable: true },
  facebook: { type: {}, hideTable: true },
  twitter: { type: {}, hideTable: true },
  github: { type: {}, hideTable: true },
  google: { type: {}, hideTable: true },
  linkedin: { type: {}, hideTable: true }
});

const validatePresenceOf = value => value && value.length;

/**
 * Virtuals
 */

UserSchema
  .virtual('password')
  .set(function (password) {
    if (!this.isNew && !password) { return; }
    this._password = password;
    this.salt = this.makeSalt();
    this.hashed_password = this.encryptPassword(password);
    console.log(this._password)
  })
  .get(function () {
    return this._password;
  });

/**
 * Validations
 */

// the below 5 validations only apply if you are signing up traditionally

UserSchema.path('name').validate(function (name) {
  if (this.skipValidation()) return true;
  return name.length;
}, 'Name cannot be blank');

UserSchema.path('email').validate(function (email) {
  if (this.skipValidation()) return true;
  return email.length;
}, 'Email cannot be blank');

UserSchema.path('email').validate(function (email, fn) {
  const User = mongoose.model('User');
  if (this.skipValidation()) fn(true);

  // Check only when it is a new user or when email field is modified
  if (this.isNew || this.isModified('email')) {
    User.find({ email: email }).exec(function (err, users) {
      fn(!err && users.length === 0);
    });
  } else fn(true);
}, 'Email already exists');

UserSchema.path('username').validate(function (username) {
  if (this.skipValidation()) return true;
  return username.length;
}, 'Username cannot be blank');

UserSchema.path('hashed_password').validate(function (hashed_password) {
  if (this.skipValidation()) return true;
  if (!this.isNew && !this._password) {
    return hashed_password.length
  }
  return hashed_password.length && this._password.length;
}, 'Password cannot be blank');


/**
 * Pre-save hook
 */

UserSchema.pre('save', function (next) {
  console.log(this.isNew)

  if (!this.isNew) return next();

  if (!validatePresenceOf(this.password) && !this.skipValidation()) {
    next(new Error('Invalid password'));
  } else {
    next();
  }
});

/**
 * Methods
 */

UserSchema.methods.authenticate = function (plainText) {
  return this.encryptPassword(plainText) === this.hashed_password;
},

  /**
   * Make salt
   *
   * @return {String}
   * @api public
   */

  UserSchema.methods.makeSalt = function () {
    return Math.round((new Date().valueOf() * Math.random())) + '';
  }

/**
 * Encrypt password
 *
 * @param {String} password
 * @return {String}
 * @api public
 */

UserSchema.methods.encryptPassword = function (password) {
  if (!password) return '';
  try {
    return crypto
      .createHmac('sha1', this.salt)
      .update(password)
      .digest('hex');
  } catch (err) {
    return '';
  }
}

/**
 * Validation is not required if using OAuth
 */

UserSchema.methods.skipValidation = function () {
  return ~oAuthTypes.indexOf(this.provider);
}

UserSchema.methods.assign = function () {
  if (this.password) {
    return "name email username password";
  }
  return "name email username";
}



/**
 * Statics
 */

UserSchema.statics.load = function (options, cb) {
  options.select = options.select || 'name username email';
  return this.findOne(options.criteria)
    .select(options.select)
    .exec(cb);
}
UserSchema.statics.list = function (cb) {
  var options = {}
  options.select = options.select || 'name username';
  options.criteria = { recordStatus: true }
  return this.find(options.criteria)
    .select(options.select)
    .exec(cb);
}
mongoose.model('User', UserSchema);
