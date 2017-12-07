const _ = require('underscore');
const orderDAO = require('../models/order.js');

exports.order = function(data,cb){
    orderDAO.setOrder(data).then(function (id) {
        orderDAO.orderMenu({id:id[0],data:data.data}).then(function (result) {
            cb(result)
        }).catch(function () { cb(false) });
    }).catch(function () { cb(false) });
};