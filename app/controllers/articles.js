'use strict';

/**
 * Module dependencies.
 */

const mongoose = require('mongoose');
const { wrap: async } = require('co');
const express = require('express');
const router = express.Router();
const only = require('only');
const { respond, respondOrRedirect } = require('../utils');
const Article = mongoose.model('Article');
const assign = Object.assign;

const base = require('./base');
base.configure(Article, "users");

router.get('/index', base.index);
router.get('/datatable', base.datatable);

router.param('id', async(function* (req, res, next, id) {
  try {
    req.article = yield Article.load(id);
    if (!req.article) return next(new Error('Article not found'));
  } catch (err) {
    return next(err);
  }
  next();
}));


router.get('/new', function (req, res) {
  res.render('articles/new', {
    title: 'New Article',
    article: new Article()
  });
});

router.post('/', async(function* (req, res) {
  const article = new Article(only(req.body, 'title body tags'));
  article.user = req.user;
  try {
    yield article.uploadAndSave(req.file);
    respondOrRedirect({ req, res }, `/articles/${article._id}`, article, {
      type: 'success',
      text: 'Successfully created article!'
    });
  } catch (err) {
    respond(res, 'articles/new', {
      title: article.title || 'New Article',
      errors: [err.toString()],
      article
    }, 422);
  }
}));


router.get('/:id/edit', function (req, res) {
  res.render('articles/edit', {
    title: 'Edit ' + req.article.title,
    article: req.article
  });
});

router.put('/', async(function* (req, res) {
  const article = req.article;
  assign(article, only(req.body, 'title body tags'));
  try {
    yield article.uploadAndSave(req.file);
    respondOrRedirect({ res }, `/articles/${article._id}`, article);
  } catch (err) {
    respond(res, 'articles/edit', {
      title: 'Edit ' + article.title,
      errors: [err.toString()],
      article
    }, 422);
  }
}));

router.get('/:id', function (req, res) {
  respond(res, 'articles/show', {
    title: req.article.title,
    article: req.article
  });
});

router.delete('/:id', async(function* (req, res) {
  yield req.article.remove();
  respondOrRedirect({ req, res }, '/articles', {}, {
    type: 'info',
    text: 'Deleted successfully'
  });
}));

 module.exports = router;