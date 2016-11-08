'use strict';

/*
 * Module dependencies.
 */

const users = require('../app/controllers/users');
const articles = require('../app/controllers/articles');
const comments = require('../app/controllers/comments');
const tags = require('../app/controllers/tags');
const auth = require('./middlewares/authorization');

 
const articleAuth = [auth.requiresLogin, auth.article.hasAuthorization];
const commentAuth = [auth.requiresLogin, auth.comment.hasAuthorization];
 

module.exports = function (app, passport) {
  const pauth = passport.authenticate.bind(passport);

  app.use('/', require('../app/controllers/index'));
  app.use('/users', require('../app/controllers/users'));
  app.use('/articles',auth.requiresLogin, require('../app/controllers/articles'));
  app.use('/customers',auth.requiresLogin, require('../app/controllers/customers'));
 

  // user routes
  //app.get('/login', users.login);
  //app.get('/signup', users.signup);
  // app.get('/logout', users.logout);
  //app.get('/users/index', users.index);
  //app.post('/users', users.create);
  //app.get('/users/datatable', users.datatable);
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
  //app.get('/users/:userId', users.show);
  //app.param('userId', users.load);


  // article routes
  //app.get('/articles/datatable', articles.datatable);
  //app.get('/articles/index', articles.index);
  //app.param('id', articles.load);
  //app.get('/articles', articles.index);
  //app.get('/articles/new', auth.requiresLogin, articles.new);
  //app.post('/articles', auth.requiresLogin, articles.create);
  //app.get('/articles/:id', articles.show);
  //app.get('/articles/:id/edit', articleAuth, articles.edit);
  //app.put('/articles/:id', articleAuth, articles.update);
 // app.delete('/articles/:id', articleAuth, articles.destroy);

 
  // comment routes
 // app.param('commentId', comments.load);
  //app.post('/articles/:id/comments', auth.requiresLogin, comments.create);
 // app.get('/articles/:id/comments', auth.requiresLogin, comments.create);
 // app.delete('/articles/:id/comments/:commentId', commentAuth, comments.destroy);

  // tag routes
 // app.get('/tags/:tag', tags.index);


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
