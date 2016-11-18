const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const enums = require('../../utils/enums');
const { wrap: async } = require('co');

const Branch = mongoose.model('Branch');

const base = require('../base').configure(Branch, "branches");




router.param('_id', base.findOne);

router.get('/index', base.index);
router.get('/datatable', base.datatable);

router.get('/edit/:_id?', base.edit);
router.post('/create', base.post);
router.post('/edit/:_id', base.put);
router.delete('/delete/:_id', base.delete);

//page level 

router.get('/tree', async(function* (req, res) {
    var trees = []
    var tree = schema.createDatatable();
    trees.push(tree);

    res.render(controller + '/index', {
        trees: trees,
        crud: {
            create: "/" + controller + "/edit/",
            update: "/" + controller + "/edit/",
            delete: "/" + controller + "/delete/",
            read: "/" + controller + "/edit/",
        }
    });
}));



module.exports = router;