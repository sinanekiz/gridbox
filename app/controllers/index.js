const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = mongoose.model('User');

router.get('/', function (req, res) {
    res.render('index');
});

router.get('/login', function (req, res) {
    res.render('users/login');
});

router.get('/signup', function (req, res) {
    res.render('users/signup', {
        user: new User(),
    });
});

router.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/login');
});

module.exports = router;