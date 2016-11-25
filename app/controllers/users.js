'use strict';

/**
 * Module dependencies.
 */

const mongoose = require('mongoose');
const { wrap: async } = require('co');
const { respond } = require('../utils');
const express = require('express');
const router = express.Router();

const User = mongoose.model('User');

const base = require('./base').configure(User, "users");

const auth = require("../../config/middlewares/authorization").checkCrudRights;

router.use(function (req, res, next) {
    return auth.findAllRights(req, req.rights.crud.user, next);
});

router.param('_id', base.findOne);

router.get('/index',auth.hasRead, base.index);
router.get('/datatable',auth.hasRead, base.datatable);

router.get('/edit/:_id?',auth.hasRead, base.edit);
router.post('/create',auth.hasCreate, base.post);
router.post('/edit/:_id',auth.hasUpdate, base.put);
router.delete('/delete/:_id',auth.hasDelete, base.delete);





router.get('/:userId', function (req, res) {
  const user = req.profile;
  respond(res, 'users/show', {
    title: user.name,
    user: user
  });
});

router.param('userId', async(function* (req, res, next, _id) {
  const criteria = { _id };
  try {
    req.profile = yield User.load({ criteria });
    if (!req.profile) return next(new Error('User not found'));
  } catch (err) {
    return next(err);
  }
  next();
}));
module.exports = router;