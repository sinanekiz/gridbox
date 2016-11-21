const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const enums = require('../../utils/enums');

const Role = mongoose.model('Role');

const base = require('../base').configure(Role, "roles");




router.param('_id', base.findOne);

router.get('/index', base.index);
router.get('/datatable', base.datatable);

router.get('/edit/:_id?', function (req, res, next) {
    res.locals.groupedRights=enums.enumGrup({rights:enums.right});
    next();
}, base.edit);
router.post('/create', base.post);
router.post('/edit/:_id', base.put);
router.delete('/delete/:_id', base.delete);

router.get('/all', base.all);

module.exports = router;