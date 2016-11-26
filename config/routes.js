'use strict';
/*
 * Module dependencies.
 */
const auth = require('./middlewares/authorization');
const rights = require('../app/utils/enums').right;

module.exports = function (app, passport) {
  const pauth = passport.authenticate.bind(passport);

  app.use(function (req, res, next) {
       req.rights=rights;  next();
  });
  app.use('/', require('../app/controllers/index'));
  app.use('/users', require('../app/controllers/users'));
  app.use('/articles', auth.requiresLogin, require('../app/controllers/articles'));
  app.use('/customers', auth.requiresLogin, require('../app/controllers/customers'));
  app.use('/roles', auth.requiresLogin, require('../app/controllers/management/roles'));
  app.use('/branches', auth.requiresLogin, require('../app/controllers/management/branches'));


  app.post('/login',
    pauth('local', {
      failureRedirect: '/login',
      failureFlash: 'Invalid email or password.'
    }), function login(req, res) {
      const redirectTo = req.session.returnTo
        ? req.session.returnTo
        : '/';
      delete req.session.returnTo;
      res.redirect(redirectTo);
    });


  /**
   * Error handling
   */

  app.use(function (err, req, res, next) {
    // treat as 404
    if (err.message
      && (~err.message.indexOf('not found')
        || (~err.message.indexOf('Cast to ObjectId failed')))) {
      return next();
    }

    console.error(err.stack);

    if (err.stack.includes('ValidationError')) {
      res.status(422).render('422', { error: err.stack });
      return;
    }

    // error page
    res.status(500).render('500', { error: err.stack });
  });

  // assume 404 since no middleware responded
  app.use(function (req, res) {
    const payload = {
      url: req.originalUrl,
      error: 'Not found'
    };
    if (req.accepts('json')) return res.status(404).json(payload);
    res.status(404).render('404', payload);
  });
};
