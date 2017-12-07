const knex = require('./knex-mysql.js');
const booth_id = 1;

exports.getTableNum = function() {
    return knex('booth').where('booth_id',booth_id).select('table_num');
}

exports.setTableNum = function(ipt) {
    return knex('booth').where('booth_id',booth_id).update({
        table_num: ipt.num,
    });
}