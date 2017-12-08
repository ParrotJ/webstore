const _ = require('underscore');
const callDAO = require('../models/call.js');

exports.call = function(data,cb){
    callDAO.call(data).then(function (result) {
        cb(result);
    }).catch(function (r) { console.log(r); cb(false) });
};

exports.getCall = function(cb){
    callDAO.getCallList().then(function (result) {
        var rtn = _.map(result,function (item) {
            return item.table_num;
        });

        cb(rtn);
    }).catch(function (r) { console.log(r); cb(false) });
};


exports.okCall = function (data,cb) {
    callDAO.okCall(data).then(function (result) {
        cb(result);
    }).catch(function (r) { console.log(r); cb(false) });
};
