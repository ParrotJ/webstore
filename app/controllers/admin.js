const _ = require('underscore');
const tableDAO = require('../models/table.js');
const menuDAO = require('../models/menus.js');

// Table function
exports.getTableNum = function(cb){
    tableDAO.getTableNum().then(function (row) {
        const rtn = {
            num : row[0].table_num,
        };
        cb(rtn);
    })
};

exports.setTableNum = function(data, cb){
    const ipt = {
        num : parseInt(data),
    };

    tableDAO.setTableNum(ipt).then(function(result){
        cb(result);
    });
};

// MENU function
exports.getMenuList = function(cb){
    menuDAO.getMenus().then(function(rows) {
        rtn = _.map(rows,function (item) {
           return {
               id   : item.menu_id,
               name : item.menu_name,
               init : item.initial_quantity,
               stock: item.stock_quantity,
               price: item.price,
               cost : item.cost,
           };
        });

        cb(rtn);
    }).catch(function () { return cb(false) });
};

exports.getMenu = function (data,cb) {
    menuDAO.getMenu(data).then(function (row) {
        cb({
            id   : row[0].menu_id,
            name : row[0].menu_name,
            init : row[0].initial_quantity,
            stock: row[0].stock_quantity,
            price: row[0].price,
            cost : row[0].cost,
        });
    }).catch(function () { return cb(false) });
};

exports.addMenu = function(data,cb){
    menuDAO.addMenu(data).then(function(result){
        cb(result);
    }).catch(function () { return cb(false) });
}

exports.editMenu = function(data,cb) {
    menuDAO.editMenu(data).then(function(result){
        cb(result);
    }).catch(function () { return cb(false) });
};

exports.removeMenu = function (data,cb) {
    menuDAO.removeMenu(data).then(function(result){
        cb(result);
    }).catch(function () { return cb(false) });
};