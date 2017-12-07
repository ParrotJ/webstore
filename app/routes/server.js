var express = require('express');
var router = express.Router();
var io  = require('../../app').io;

const adminCtrl = require('../controllers/admin.js');
const orderCtrl = require('../controllers/order.js');

/* GET home page. */
router.get('/', function(req, res, next) {
    adminCtrl.getTableNum(function (rtn) {
        res.render('server/index', { table_num: rtn.num, booth_id: 1 });
    });
});

router.get('/order', function(req, res, next) {
    adminCtrl.getMenuList(function (data) {
        res.render('server/order',{ table_num: req.query.tnum, items:data});
    });
});

router.put('/order', function(req, res, next) {
    orderCtrl.order(req.body,function (result) {
        if(result) res.status(200).send();
        else res.status(403).send();
    });
});

module.exports = router;
