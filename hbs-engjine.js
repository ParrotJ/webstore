const hbs = require('hbs');

hbs.registerHelper('numberWithCommas', function(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
});

hbs.registerHelper('times', function(n, block) {
    var accum = '';
    for(var i = 1; i <= n; ++i)
        accum += block.fn(i);
    return accum;
});

exports.module =  hbs;