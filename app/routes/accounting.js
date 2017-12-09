var express = require('express');
var router = express.Router();

const accountingCtrl = require('../controllers/accounting.js');

/* GET Accounting Index. */
router.get('/', function(req, res, next) {
    res.render('accounting/index');
});

/* GET Stock list. */
router.get('/stock', function(req, res, next) {
    accountingCtrl.getStockList(function (data) {
        res.render('accounting/stock',{items:data});
    });
});


module.exports = router;
