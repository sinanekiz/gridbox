'use strict';

var right = require("../../app/utils/enums").right;
var {allBranches} = require("../../app/utils/helper");

/*
 *  Generic require login routing middleware
 */

exports.requiresLogin = function (req, res, next) {
  if (req.isAuthenticated()) return next();
  if (req.method == 'GET') req.session.returnTo = req.originalUrl;
  res.redirect('/login');
};


/*
 *  User authorization routing middleware
 */

var checkCrudRights = {
  hasRights: {}, 
  rights: {}, 
  findAllRights: function (req, rights) {
    checkCrudRights.hasRights = {}
    checkCrudRights.rights = rights
    req.user.branchRoles.filter(function (branchRole) {
      branchRole.roles.filter(function (role) {
        if (role.rights.indexOf(rights.read) > -1) {
          checkCrudRights.hasRights.read = true;
        }
        if (role.rights.indexOf(rights.create) > -1) {
          checkCrudRights.hasRights.create = true;
          checkCrudRights.hasRights.read = true;
        }
        if (role.rights.indexOf(rights.update) > -1) {
          checkCrudRights.hasRights.update = true;
          checkCrudRights.hasRights.read = true;
        }
        if (role.rights.indexOf(rights.delete) > -1) {
          checkCrudRights.hasRights.delete = true;
          checkCrudRights.hasRights.read = true;
        }
      })
    })
  },
  hasRead: function (req, res, next) {
    req.currentRight=checkCrudRights.rights.read;
    if (!checkCrudRights.hasRights.read) {
      req.flash('info', 'You are not authorized');
      return res.render('error');
    }
    next();
  },
  hasCreate: function (req, res, next) {
    req.currentRight=checkCrudRights.rights.create;
    if (!checkCrudRights.hasRights.create) {
      req.flash('info', 'You are not authorized');
      return res.render('error');
    }
    next();
  },
  hasUpdate: function (req, res, next) {
    req.currentRight=checkCrudRights.rights.update;
    if (!checkCrudRights.hasRights.update) {
      req.flash('info', 'You are not authorized');
      return res.render('error');
    }
    next();
  },
  hasDelete: function (req, res, next) {
    req.currentRight=checkCrudRights.rights.delete;
    if (!checkCrudRights.hasRights.delete) {
      req.flash('info', 'You are not authorized');
      return res.render('error');
    }
    next();
  }
};
exports.checkCrudRights = checkCrudRights;

/*
 *  Article authorization routing middleware
 */

exports.article = {
  hasAuthorization: function (req, res, next) {
    if (req.article.user.id != req.user.id) {
      req.flash('info', 'You are not authorized');
      return res.redirect('/articles/' + req.article.id);
    }
    next();
  }
};

/**
 * Comment authorization routing middleware
 */

exports.comment = {
  hasAuthorization: function (req, res, next) {
    // if the current user is comment owner or article owner
    // give them authority to delete
    if (req.user.id === req.comment.user.id || req.user.id === req.article.user.id) {
      next();
    } else {
      req.flash('info', 'You are not authorized');
      res.redirect('/articles/' + req.article.id);
    }
  }
};
