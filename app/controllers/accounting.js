const _ = require('underscore');
const moment = require('moment');

const menuDAO = require('../models/menus.js');
const orderDAO = require('../models/order.js');

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
                price: item.price,
                cost : item.cost,
                total: total,
            };
        });

        cb(rtn);
    }).catch(function () { return cb(false) });
};

exports.getSalesList = function(cb){
    orderDAO.getOrderList().then(function (value) {
        const rtn = _.map(value,function(item){
            let time = moment(item.order_time).format('hh:mm:ss');
            const rtn = {
                tnum : item.table_num,
                time : time,
                total : item.order_price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                menu : [],
            };

            rtn.menu = _.map(item.menu, function (menu) {
                return {
                    name : menu.menu_name,
                    num : menu.quantity,
                    servingOk : menu.serving_complement,
                    cookingOk : menu.cooking_complement,
                };
            });

            return rtn;
        });

        cb(rtn);
    });
}