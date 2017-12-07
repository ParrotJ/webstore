const _ = require('underscore');
const knex = require('./knex-mysql.js');
const booth_id = 1;

exports.setOrder = function(data) {
    var ipt = {
        table_num : data.tnum,
        order_price : data.sum,
    };

    return knex('orders').insert(ipt);
}
exports.orderMenu = function(data) {
    var ipt = _.map(data.data,function (menu) {
       return {
           order_id: data.id,
           menu_id: menu.id,
           quantity: menu.num,
       };
    });
    return knex('orders_menu').insert(ipt);
}
