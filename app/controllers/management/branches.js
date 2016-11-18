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
    var tree = yield Branch.list({});
    tree = tree.filter(function (t) {
        t.id = t._id;
        t.text = t.name;
    })
    res.render('branches/tree', {
        tree: tree,
        crud: {
            create: "/" + "branches" + "/edit/",
            update: "/" + "branches" + "/edit/",
            delete: "/" + "branches" + "/delete/",
            read: "/" + "branches" + "/edit/",
        }
    });
}));

router.get('/all', async(function* (req, res) {

    var all = yield Branch.list({});

    res.send({ value: all });
}));

router.get('/treeList', async(function* (req, res) {

    var tree = yield Branch.list({});
    var data = []
    tree.filter(function (t) {
        data.push({
            id: t._id,
            text: t.name,
            parent: t.parent || "#",
            state: {
                opened: true
            },
            type:t.__t
        })
    });
    res.send(data);
}));



module.exports = router;