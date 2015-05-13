var express = require('express');
var router = express.Router();
var fs = require('fs');
 
// Object 
var manager = {
	TbNum: "",
 	Order: "",
	Sum: "",
	Time: ""
};

var menu = {
	name: "",
	price: "",
	stock: "",
  max: "",
};

var food = {
  name: "",
  order: [{
    TbNum: "",
    amount: ""
  }]
};

// Global Val
var file = 'order.txt';
var managers = [];
var menus = [];
var foods = [];
var TbNum = 0;

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/restore',function(req,res){
  fs.readFile('set.txt', 'utf8', function(err, data) {
    var obj = JSON.parse(data);

    managers = obj.managers;
    menus = obj.menus;
    foods = obj.foods;
  });

  res.redirect('/');
});

/* Setting Table */ 
router.get('/SetTable', function(req, res) {
  res.render('settable');
});

router.get('/SaveTable', function(req, res) {
  TbNum = req.query.TbNum;

  res.redirect('/');
});

/* Setting Menu */
router.get('/SetMenu', function(req, res) {
  console.log(menus);

  res.render('listmenu',{menu:menus});
});

router.get('/MenuForm', function(req, res) {
  var mod = req.query.mod;

  if(mod == "add") 
  	res.render('menuform',{content:menu,mod:mod+"menu",path:""});
  else if(mod =="edit")
  {  
	var search = decodeURI(req.query.search);
	
	for(i in menus){
	  if(menus[i].name == search){
		var tmp = {
        	  name: menus[i].name,
        	  price: menus[i].price,
        	  stock: menus[i].stock,
            max: menus[i].max
        	};
	  	
		res.render('menuform',{content:tmp,mod:mod+"menu",path:i});
		break;	
    }
	};
  }
});

router.post('/addmenu', function(req, res) {
  console.log(req.body);

  var menu = {
	  name: req.body.name,
	  price: req.body.price,
	  stock: req.body.stock,
    max: req.body.stock
  };

  var food = {
    name: req.body.name,
    order: []
  };
  
  menus.push(menu);

  if(req.body.drunk != 'on')
    foods.push(food);

  res.redirect('/SetMenu');
});

router.post('/editmenu', function(req, res) {
  var path = req.body.path;

  //max변수 수정 필요
  console.log(req.body);
  menus[path]= req.body;

  res.redirect('/SetMenu');	
});


/* View Manager */
router.get('/Manager', function(req, res) {

  res.render('manager',{manager:managers});
});

router.get('/read',function(req,res){
  res.render('read');
});

router.post('/readOrder',function(req,res){
  var data = req.body.data;
  var file = JSON.parse(data);

  res.render('readOrder',{manager:file});
});


/* TF */
router.get('/tf', function(req, res) {
  res.render('tf',{TbNum:TbNum});
});

router.get('/order', function(req,res) { 
  res.render('order',{menu:menus});
});

router.post('/transaction',function(req,res){
  var bill = JSON.parse(req.body.obj);
 
  console.log(bill);

  if(bill.Order.length == 0) {
    res.send(['다시 주문해주세요.','Order?TbNum='+bill.TbNum]);
  }
  else {
    var Order = "";
    console.log(bill.Service);
    if(bill.Service)
      Order += '<b style="font-size:1.3rem">서비스 </b>';

    for(i in bill.Order){
      Order += bill.Order[i].name +" "+bill.Order[i].num+"  <b style='font-size:1.3rem'>|</b>  ";

      for(j in foods){
        if(foods[j].name == bill.Order[i].name){
          var foodrank = foods[j].order;

          foodrank.push({
            TbNum: bill.TbNum,
            amount: bill.Order[i].num
          });
        }
      }  
    }

    managers.push({
      TbNum: bill.TbNum,
      Order: Order,
      Sum: bill.Sum,
      Time: bill.Time
    });

    fs.writeFile(file, JSON.stringify(managers), 'utf8', function(error){
      console.log('write end');
    });

    var obj = {managers:managers,menus:menus,foods:foods};

    fs.writeFile('set.txt', JSON.stringify(obj),'utf8',function(err){
      console.log('wrige end');
    });


    res.send(['주문접수 되었습니다.','/tf'])
   }
});

/* Food */
router.get('/Food',function(req,res){
  res.render('food',{menu:foods});
});

router.get('/Food/:name',function(req,res){
  var list;
  
  for(i in foods)
    if(foods[i].name ==  req.params.name) list = foods[i].order;

  res.render('foodrank',{food:list})
});

router.get('/Food/:name/del',function(req,res){
  var id = req.query.id;
  var name = req.params.name;

  for(i in foods){
    if(foods[i].name == name) {
      var list = foods[i].order;
      
      list.splice(id,1);
    }
  }

  res.send('');
});

/* tableState */
router.get('/tablelist',function(req,res){
  res.render('tablelist',{TbNum:TbNum});
});

router.get('/status',function(req,res){
  var order = [];
  var Tb = req.query.TbNum;

  for(i in foods)
    for (j in foods[i].order)
      if(foods[i].order[j].TbNum == Tb)
        order.push({name:foods[i].name, amount:foods[i].order[j].amount});

  res.render('status',{food:order}); 
});

module.exports = router;
