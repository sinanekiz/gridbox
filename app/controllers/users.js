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

const {checkCrudRights} = require("../../config/middlewares/authorization");

router.use(function (req, res, next) {
   checkCrudRights.findAllRights(req, req.rights.crud.user);next();
});

router.param('_id', base.findOne);

router.get('/index',checkCrudRights.hasRead, base.index);
router.get('/datatable',checkCrudRights.hasRead, base.datatable);

router.get('/edit/:_id?',checkCrudRights.hasRead, base.edit);
router.post('/create',checkCrudRights.hasCreate, base.post);
router.post('/edit/:_id',checkCrudRights.hasUpdate, base.put);
router.delete('/delete/:_id',checkCrudRights.hasDelete, base.delete);

 
module.exports = router;