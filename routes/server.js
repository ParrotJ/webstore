var express = require('express');
var router = express.Router();
var io  = require('../app').io;

/* GET home page. */
router.get('/', function(req, res, next) {

  res.render('server/index', { title: 'Express' });
});

router.get('/order', function(req, res, next) {

  res.render('server/order', { title: 'Express' });
});

module.exports = router;
