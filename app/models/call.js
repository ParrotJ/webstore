const knex = require('./knex-mysql.js');

exports.call = function (data) {
    return knex('calls').insert({'table_num': data});
}

exports.getCallList = function () {
    return knex('calls').where({'call_complement': 0}).select('table_num');
}

exports.okCall = function (data) {
    return knex('calls').where({'table_num': data})
        .update({
            call_complement: 1
        });
}