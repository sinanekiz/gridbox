const mongoose = require('mongoose');
const { wrap: async } = require('co');
const { respond } = require('../utils');
const express = require('express');
const router = express.Router();
var ElapsedTime = require('elapsed-time');
var guid = require('guid');


const Customer = mongoose.model('Customer');

const base = require('./base').configure(Customer, "customers");

router.get('/index', base.index);
router.get('/datatable', base.datatable);

router.get('/createAll', async(function* (req, res) {


    var et = ElapsedTime.new().start();
    //Customer.createIndex({ field: 1 }, { background: true });

    //milion data test
    //for (var i = 0; i < 100000; i++) {

    //    var data = { name: guid.create().value.toString(), surname: guid.create().value, province: guid.create().value, district: guid.create().value, neigbourhood: guid.create().value }
    //   var newCustomer = new Customer(data)
    //    yield newCustomer.save();

    // }

Customer.find({name:'0006ee7f-a337-d02e-d793-ade2a66b30b6'},function(result,data){

    console.log(data)
    console.log(et.getValue())

})

    res.send({ result: et.getValue() });
}));

module.exports = router;