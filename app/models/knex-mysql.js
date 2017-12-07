const knex = require('knex')({
    client: 'mysql',
    connection: {
        host : '127.0.0.1',
        user : 'test',
        password : 'test',
        database : 'wp_teamproject'
    }
});

module.exports = knex;