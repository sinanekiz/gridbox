const mongoose = require('mongoose');
const { wrap: async } = require('co');
const { respond } = require('../utils');
const express = require('express');
const router = express.Router();
var ElapsedTime = require('elapsed-time');
var guid = require('guid');


const Customer = mongoose.model('Customer');

const base = require('./base').configure(Customer, "customers");

router.param('_id', base.findOne);

router.get('/index', base.index);
router.get('/datatable', base.datatable);

router.get('/edit/:_id?', base.edit);
router.post('/create',   base.post);
router.post('/edit/:_id',   base.put);
router.delete('/delete/:_id',   base.delete);

router.get('/createAll', async(function* (req, res) {


    var et = ElapsedTime.new().start();
    var list = [];
    //milion data test
    for (var i = 0; i < 300000; i++) {

        var data = { name: guid.create().value.toString(), surname: guid.create().value, province: guid.create().value, district: guid.create().value, neigbourhood: guid.create().value }
        var newCustomer = new Customer(data)
        list.push(data);

    }
    Customer.collection.insert(list,
        { ordered: false }, onInsert);

    function onInsert(err, docs) {
        if (err) {
            console.log(err)
        } else {
            console.info('%d potatoes were successfully stored.', docs.length);
            res.send({ result: et.getValue() })
        }
    }

}));

router.get('/threading', async(function* (req, res) {


    var et = ElapsedTime.new().start();
    var list = [];
    var start = false;
    //milion data test
    var counter = 0;
    for (var i = 0; i < 1000; i++) {


        var data = { name: guid.create().value.toString(), surname: guid.create().value, province: guid.create().value, district: guid.create().value, neigbourhood: guid.create().value }
        var newCustomer = new Customer(data);
        newCustomer.save();

    }

    res.redirect("/customers/threading");

}));


module.exports = router;