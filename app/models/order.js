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

exports.getOrderMenu = function(){

  return knex('orders_menu')
          .join('menu', 'orders_menu.menu_id', 'menu.menu_id')
          .join('orders', 'orders_menu.order_id', 'orders.order_id')
          .where('orders_menu.cooking_complement',0)
          .select('orders_menu.order_id','orders_menu.menu_id','orders.table_num', 'menu.menu_name', 'orders_menu.quantity');
}

exports.setCookMenu = function(data) {
  var ipt = {
    order_id : data.item.oid,
    menu_id : data.item.mid,
  };

  return knex('orders_menu').where(ipt).update({
      cooking_complement: 1,
  });
}

exports.getCookOkMenu = function(data) {
  var ipt = {
    cooking_complement : 1,
    serving_complement : 0,
  };

  return knex('orders_menu')
          .join('menu', 'orders_menu.menu_id', 'menu.menu_id')
          .join('orders', 'orders_menu.order_id', 'orders.order_id')
          .where(ipt)
          .select('orders_menu.order_id','orders_menu.menu_id','orders.table_num', 'menu.menu_name', 'orders_menu.quantity');
}


exports.setServingMenu = function(data) {
  var ipt = {
    order_id : data.item.oid,
    menu_id : data.item.mid,
  };

  return knex('orders_menu').where(ipt).update({
      serving_complement: 1,
  });
}
