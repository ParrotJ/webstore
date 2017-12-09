var socket = require('socket.io');
var io = socket();

const adminCtrl = require('../controllers/admin.js');
const callCtrl = require('../controllers/call.js');
const orderCtrl = require('../controllers/order.js');
const accountingCtrl = require('../controllers/accounting.js');

io.sockets.on('connection', function(socket) {
    // Join booth
    socket.on('join:booth-server', function(data) {
        socket.join('booth-server' + data.bid);

        callCtrl.getCall(function(rtn){
            socket.emit('call:server', rtn);
        });

        orderCtrl.getCookOk(data,function(rtn){
            io.sockets.in('booth-server' + data.bid).emit('cookOk:server', rtn);
        });
    });

    socket.on('join:booth-customer', function(data) {
        socket.join('booth-customer' + data.bid);
    });

    socket.on('join:booth-cook', function(data) {
      socket.join('booth-cook' + data.bid);

      orderCtrl.getOrderMenu(function(data){
        socket.emit('order:cook', data);
      });
      adminCtrl.getMenuList(function(data) {
        socket.emit('initFilter:cook', data);
      });
    });

    socket.on('join:booth-accounting',function(data){
        socket.join('booth-accounting' + data.bid);

        accountingCtrl.getStockList(function (data) {
            socket.emit('getStock:accounting', data);
        });

        accountingCtrl.getSalesList(function (data){
            socket.emit('getSales:accounting', data);
        })
    });

    // Call server
    socket.on('call:server', function(data) {
        callCtrl.call(data.tnum,function () {
            callCtrl.getCall(function(rtn){
                io.sockets.in('booth-server' + data.bid).emit('call:server', rtn);
            });
        });
    });

    // Call Ok server
    socket.on('callOk:server', function (data) {
       callCtrl.okCall(data.tnum,function(){
           callCtrl.getCall(function(rtn){
               io.sockets.in('booth-server' + data.bid).emit('call:server', rtn);
               io.sockets.in('booth-customer' + data.bid).emit('callOk:customer',data.tnum);
           });
       });
    });

    socket.on('cookOk:cook', function (data){
      orderCtrl.setCookOk(data,function(){
        orderCtrl.getCookOk(data,function(rtn){
          io.sockets.in('booth-server' + data.bid).emit('cookOk:server', rtn);

          orderCtrl.getOrderMenu(function(rtn){
            io.sockets.in('booth-cook' + data.bid).emit('order:cook', rtn);
          });

            accountingCtrl.getSalesList(function (data){
                io.sockets.in('booth-accounting' + data.bid).emit('getSales:accounting', data);
            });
        });
      });
    });

    socket.on('servingOk:server', function(data) {
      orderCtrl.setServingOk(data,function(){
        orderCtrl.getCookOk(data,function(rtn){
          io.sockets.in('booth-server' + data.bid).emit('cookOk:server', rtn);
        });

          accountingCtrl.getSalesList(function (data){
              io.sockets.in('booth-accounting' + data.bid).emit('getSales:accounting', data);
          })
      });
    });
});

module.exports = {io : io};
