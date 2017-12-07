var express = require('express');
var router = express.Router();
var io  = require('../../app').io;

/* GET home page. */
router.get('/', function(req, res, next) {

    res.render('customer/index', { title: 'Express' });
});

module.exports = router;
