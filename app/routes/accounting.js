var express = require('express');
var router = express.Router();

const accountingCtrl = require('../controllers/accounting.js');

/* GET Accounting Index. */
router.get('/', function(req, res, next) {
    res.render('accounting/index');
});

/* GET Stock list. */
router.get('/stock', function(req, res, next) {
    res.render('accounting/stock');
});

/* GET Sales list. */
router.get('/sales', function(req, res, next) {
    res.render('accounting/sales');
});



module.exports = router;
