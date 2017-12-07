const knex = require('./knex-mysql.js');
const booth_id = 1;

exports.getMenus = function() {
    return knex('menu').where('booth_id',booth_id).select();
};

exports.getMenu = function(data) {
    const ipt = {
        booth_id : booth_id,
        menu_id : data,
    };

    return knex('menu').where(ipt).select();
};

exports.addMenu = function(data) {
    const ipt = {
        booth_id : booth_id,
        menu_name: data.name,
        initial_quantity : data.init,
        stock_quantity : data.stock,
        price : data.price,
        cost : data.cost,
    };

    return knex('menu').insert(ipt);
};

exports.editMenu = function(data) {
    const where = {
        booth_id : booth_id,
        menu_id : data.id,
    };
    const ipt = {
        menu_name: data.name,
        initial_quantity : data.init,
        stock_quantity : data.stock,
        price : data.price,
        cost : data.cost,
    };

    return knex('menu').where(where).update(ipt);
};

exports.removeMenu = function(data){
    const ipt = {
        booth_id : booth_id,
        menu_id : data.id,
    };

    return knex('menu').where(ipt).del();
}