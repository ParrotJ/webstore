var router = require('express').Router();
var DB = require('./lib/data_class');

/* GET home page. */
router.get('/', function(req, res, next){
  res.render('index');
});

router.get('/restore',function(req,res){
  DB.restore();

  res.redirect('/');
});


/* 
  View Page
    1. Set Table
    2. Menu List
       - Menu Form
    3. Bill List
    4. Serving TF List
       - Order Form
    5. Cooking TF List
       - Order Food
    6. Manager Table List
       - Bill List

*/

router.get('/setTable', function(req, res) {
  res.render('setTable');

  });
  router.get('/SaveTable', function(req, res) {
    DB.tbNum = req.query.tbNum;
    DB.backUp();

    res.redirect('/');
});

router.get('/menuList', function(req, res) {
  res.render('List_menu',{'menu':DB.menus});
  
  });
  router.get('/menuForm', function(req, res) {
    var mod = req.query.mod;
    var id = req.query.id;
    var LenderObj;

    switch(mod){
      case 'add':
        LenderObj = {
          content:{},
          mod:'add?type=menu'
        }
        break;
      case 'edit':
        LenderObj = {
          content: DB.menus[id],
          mod:'edit?type=menu&id='+id
        }
    }

    res.render('Form_menu',LenderObj);
  });

router.get('/billList', function(req, res) {
  res.render('List_bill',{'bill':DB.bills});
});

router.get('/tfList', function(req, res) {
  res.render('List_tf',{'tbNum':DB.tbNum});

  });
  router.get('/orderForm', function(req,res) { 
    res.render('Form_order',{'menu':DB.menus});
  });

router.get('/foodList',function(req,res){
  var list = [];
  var menus = DB.menus;

  for(i in menus) if(!menus[i].alcohol) list.push(menus[i]);

  res.render('List_food',{menu:list});

  })
  router.get('/foodList/:name',function(req,res){
    var sendObj;
    var menus = DB.menus;
    
    for(i in menus)
      if(menus[i].name ==  req.params.name)
        sendObj = {
          'food':menus[i].order,
          'index': i
        }

    console.log(sendObj);
    res.render('Order_food',sendObj);
  });

router.get('/statusList',function(req,res){
  var table = [];
  var menus = DB.menus;

  for(i in menus)
    for(j in menus[i].order)
      table.push(menus[i].order[j].tbNum);

  table = table.reduce(function(a,b){if (a.indexOf(b) < 0 ) a.push(b);return a;},[]).sort();
  
  res.render('List_tbStatus',{tbNum:table});

  });
  router.get('/statusList/:id',function(req,res){
    var order = [];
    var id = req.params.id;
    var menus = DB.menus;

    for(i in menus)
      for(j in menus[i].order)
        if(menus[i].order[j].tbNum == id)
          order.push({name:menus[i].name, amount:menus[i].order[j].amount,time:menus[i].order[j].time});

    res.render('status',{food:order}); 
  });


/*  
    Object Control URL function
    add, edit, del, transaction
*/
router.all('/add',function(req,res){
  DB.add(req,res);
  DB.backUp();
});

router.all('/edit',function(req,res){
  DB.edit(req,res);
  DB.backUp();
});

router.all('/del',function(req,res){
  DB.del(req,res);
  DB.backUp();
});


module.exports = router;
