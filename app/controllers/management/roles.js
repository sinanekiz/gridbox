const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const enums = require('../../utils/enums');

const Role = mongoose.model('Role');

const base = require('../base').configure(Role, "roles");

const auth = require("../../../config/middlewares/authorization").checkCrudRights;

router.use(function (req, res, next) {
   auth.findAllRights(req, req.rights.crud.role); next();
});


router.param('_id', base.findOne);

router.get('/index', auth.hasRead, base.index);
router.get('/datatable', auth.hasRead, base.datatable);

router.get('/edit/:_id?', auth.hasRead, function (req, res, next) {
    res.locals.groupedRights = enums.enumGrup({ rights: enums.right });
    next();
}, base.edit);
router.post('/create', auth.hasCreate, base.post);
router.post('/edit/:_id', auth.hasUpdate, base.put);
router.delete('/delete/:_id', auth.hasDelete, base.delete);

router.get('/all', base.all);

module.exports = router;