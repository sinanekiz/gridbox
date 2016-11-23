const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = mongoose.model('User');
const Role = mongoose.model('Role');
const Branch = mongoose.model('Branch');
const auth = require('../../config/middlewares/authorization');
const { wrap: async } = require('co');

router.get('/',auth.requiresLogin, function (req, res) {
    res.render('index');
});

router.get('/login', function (req, res) {
    res.render('users/login');
});

router.get('/firstLogin', function (req, res) {
    res.render('users/signup', {
        user: new User(),
    });
});

router.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/login');
});

router.post('/firstLogin', async(function* (req, res) {
    
    const branch = new Branch({name:"Base"});
    yield branch.save();

    const role = new Role({name:"Base",rights:[1,2,3,4,5,6,7,8,9,10,11,12]});
    yield role.save();
    
    const user = new User(req.body);
    user.provider = 'local';
    user.branchRoles = [{
        branch:branch._id,
        roles:[role._id]
    }];
    try {
      yield user.save();
      req.logIn(user, err => {
        if (err) req.flash('info', 'Sorry! We are not able to log you in!');
        return res.redirect('/');
      });
    } catch (err) {
      const errors = Object.keys(err.errors)
        .map(field => err.errors[field].message);

      res.render('users/signup', {
        title: 'Sign up',
        errors,
        user
      });
    }
  }));


module.exports = router;