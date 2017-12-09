const _ = require('underscore');

const menuDAO = require('../models/menus.js');

exports.getStockList = function(cb){
    menuDAO.getMenus().then(function(rows) {
        const rtn = _.map(rows,function (item) {
            let sales = item.initial_quantity - item.stock_quantity;
            let total = sales * item.cost;

            return {
                name : item.menu_name,
                init : item.initial_quantity,
                stock: item.stock_quantity,
                sales: sales,
                cost : item.cost,
                total: total,
            };
        });

        cb(rtn);
    }).catch(function () { return cb(false) });
};