var express = require('express');
var router = express.Router();
var io  = require('./io.js').io;

const orderCtrl = require('../controllers/order.js');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('../views/cook/index');
});

module.exports = router;
