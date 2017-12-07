var socket = require('socket.io');
var io = socket();

const callCtrl = require('../controllers/call.js');


io.sockets.on('connection', function(socket) {
    // Join booth
    socket.on('join:booth', function(data) {
        socket.join('booth' + data.bid);

        callCtrl.getCall(function(rtn){
            socket.emit('call:server', rtn);
        });
    });

    // Call server
    socket.on('call:server', function(data) {
        callCtrl.call(data.tnum,function () {
            callCtrl.getCall(function(rtn){
                io.sockets.in('booth' + data.bid).emit('call:server', rtn);
            });
        });
    });

    // Call Ok server
    socket.on('callOk:server', function (data) {
       callCtrl.okCall(data.tnum,function(){
           callCtrl.getCall(function(rtn){
               io.sockets.in('booth' + data.bid).emit('call:server', rtn);
           });
       });
    });
});

module.exports = {io : io};