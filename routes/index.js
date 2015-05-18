var express = require('express');
var router = express.Router();
var fs = require('fs');
 
// Object 
var bill = {
	tbNum: "",
 	order: "",
	sum: "",
	time: ""
};

var menu = {
	name: "",
	price: "",
	stock: "",
  max: "",
  alcohol: "",
  order: [{
    tbNum: "",
    amount: "",
    time:"'"
  }]
};

// Global Val
var ledger = 'orderList.txt';
var backup = 'backup.txt';
var bills = [];
var menus = [];
var TbNum = 0;

//Function
function BackUp(){
  var obj = {TbNum:TbNum,bills:bills,menus:menus};

  fs.writeFile(backup, JSON.stringify(obj),'utf8',function(err){
    console.log('wrige end');
  });
}

/* GET home page. */
router.get('/', function(req, res, next) {

  res.render('index');
});

router.get('/restore',function(req,res){
  fs.readFile( backup, 'utf8', function(err, data) {
    var obj = JSON.parse(data);
    TbNum = obj.TbNum;
    bills = obj.bills;
    menus = obj.menus;
  });

  res.redirect('/');
});


/* 
               List View Page              
*/
router.get('/menuList', function(req, res) {
  res.render('List_menu',{menu:menus});
});

router.get('/billList', function(req, res) {
  res.render('List_bill',{bill:bills});
});

router.get('/tfList', function(req, res) {
  res.render('List_tf',{TbNum:TbNum});
});

router.get('/foodList',function(req,res){
  var list = [];

  for(i in menus)
    if(!menus[i].alcohol) list.push(menus[i]);

  res.render('List_food',{menu:list});
})
router.get('/foodList/:name',function(req,res){
  var list;
  
  for(i in menus)
    if(menus[i].name ==  req.params.name) list = menus[i].order;

  res.render('foodrank',{food:list})
});

router.get('/statusList',function(req,res){
  var table = [];

  for(i in menus)
    for(j in menus[i].order)
      table.push(menus[i].order[j].tbNum);

  table = table.reduce(function(a,b){if (a.indexOf(b) < 0 ) a.push(b);return a;},[]).sort();
  
  res.render('List_tbStatus',{tbNum:table});
});
router.get('/statusList/:id',function(req,res){
  var order = [];
  var id = req.params.id;

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
  switch(req.query.target){
    case 'menu':
      menus.push({
        name: req.body.name,
        price: req.body.price,
        stock: req.body.stock,
        max: req.body.max,
        alcohol: (req.body.alcohol == 'on')? 'checked':'',
        order: []
      });

      res.redirect('/menuList');
      break;
  }

  BackUp();
});

router.all('/edit',function(req,res){
  var target = req.query.target;

  switch(target){
    case 'menu':
      var id = req.query.id;

      menus[id].name = req.body.name;
      menus[id].price = req.body.price;
      menus[id].stock = req.body.stock;
      menus[id].max = req.body.max;
      menus[id].alcohol = (req.body.alcohol == 'on')? 'checked':'',

      res.redirect('/menuList');       
      break;
  }

  BackUp();
});

router.all('/del',function(req,res){
  var target = req.query.target;

  switch(target){
    case 'menu':
      menus.splice(req.query.id,1);

      res.redirect('/menuList');
      break;
    case 'bill':
      bills.splice(req.query.id,1);

      res.redirect('/billList');
      break;
  }

  BackUp();
});


router.post('/transaction',function(req,res){
  var bill = JSON.parse(req.body.obj);

  if(bill.Order.length == 0) {
    res.send(['다시 주문해주세요.','Order?TbNum='+bill.TbNum]);
  }
  else {
    var Order = "";
    
    if(bill.Service)
      Order += '<b style="font-size:1.3rem">서비스 </b>';

    for(i in bill.Order){
      Order += bill.Order[i].name +" "+bill.Order[i].num+"  <b style='font-size:1.3rem'>|</b>  ";

      for(j in menus){
        if(menus[j].name == bill.Order[i].name && !menus.alcohol){
          //menus[j].stock -= bill.Order[i].num;
          menus[j].order.push({
            tbNum: bill.TbNum,
            amount: bill.Order[i].num,
            time: bill.Time
          });
        }
      }  
    }

    bills.push({
      tbNum: bill.TbNum,
      order: Order,
      sum: bill.Sum,
      time: bill.Time
    });

    BackUp();
    res.send(['주문접수 되었습니다.','/tfList'])
   }
});


/* 
    Form 
*/
router.get('/menuForm', function(req, res) {
  var mod = req.query.mod;
  var dataObj;

  if(mod == "add"){
    dataObj = {
      content:menu,
      mod:'add?target=menu'
    }
  }
  else if(mod =="edit")
  {  
    var id = req.query.id;
    dataObj = {
      content: menus[id],
      mod:'edit?target=menu&id='+id
    }	
	}

  res.render('Form_menu',dataObj);
});

router.get('/orderForm', function(req,res) { 
  res.render('Form_order',{menu:menus});
});


/* Setting Table */ 
router.get('/SetTable', function(req, res) {
  res.render('settable');
});

router.get('/SaveTable', function(req, res) {
  TbNum = req.query.TbNum;

  res.redirect('/');
});


/* View Manager */
router.get('/read',function(req,res){
  res.render('read');
});

router.post('/readOrder',function(req,res){
  var data = req.body.data;
  var file = JSON.parse(data);

  res.render('readOrder',{manager:file});
});


module.exports = router;
