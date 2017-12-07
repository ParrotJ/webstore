var express = require('express');
var router = express.Router();
var io  = require('../../app').io;

/* GET home page. */
router.get('/menus', function(req, res, next) {

  res.render('admin/menus');
});

router.get('/menus/add', function(req, res, next) {

  res.render('admin/add');
});

router.get('/menus/:id', function(req, res, next) {

  res.render('admin/edit');
});

module.exports = router;
