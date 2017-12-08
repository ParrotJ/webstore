const _ = require('underscore');
const orderDAO = require('../models/order.js');

exports.order = function(data,cb){
    orderDAO.setOrder(data).then(function (id) {
        orderDAO.orderMenu({id:id[0],data:data.data}).then(function (result) {
            cb(result)
        }).catch(function (r) { console.log(r); cb(false) });
    }).catch(function (r) { console.log(r); cb(false) });
};

exports.getOrderMenu = function(cb){
    orderDAO.getOrderMenu().then(function(result){
      var rtn = _.map(result,function(item){
        return {
          oid: item.order_id,
          mid: item.menu_id,
          name: item.menu_name,
          num : item.quantity,
          tnum: item.table_num,
        };
      });

      cb(rtn);
    }).catch(function (r) { console.log(r);cb(false) });
}

exports.setCookOk = function(data,cb){
  orderDAO.setCookMenu(data).then(function (result){
    cb(result)
  }).catch(function (r) { console.log(r);cb(false) });
}

exports.getCookOk = function(data,cb){
  orderDAO.getCookOkMenu(data).then(function (result){
    var rtn = _.map(result,function(item){
      return {
        oid: item.order_id,
        mid: item.menu_id,
        name: item.menu_name,
        num : item.quantity,
        tnum: item.table_num,
      };
    });

    cb(rtn);
  }).catch(function (r) { console.log(r);cb(false) });
}


exports.setServingOk = function(data,cb){
  orderDAO.setServingMenu(data).then(function (result){
    cb(result)
  }).catch(function (r) { console.log(r);cb(false) });
}
