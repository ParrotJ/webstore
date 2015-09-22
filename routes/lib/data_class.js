var fs = require('fs');

//회계 장부( 총무 페이지 용 )
var bill = {
	'tbNum': '테이블 번호',
 	'order': '주문 내역',
	'sum': '주문 합계 금액',
	'time': '주문 시각',
	'del': [{
			'id': '물품 번호',
			'amount': '물품 수량'
	}]
};

//메뉴 목록( 전체 구동을 위한 용 )
var menu = {
	'name': '물품 이름',
	'price': '물품 가격',
	'stock': '현재 재고량',
	'max': '주문 재고량',
	'alcohol': '술여부( 빠른 주점 운영을 위해 조리 목록에서 제외하기 위해 )',
	'order': [{
    	'tbNum': '주문 테이블 번호',
    	'amount': '수량',
    	'time':'주문 시각' 
	}]
};

var backupFile = 'backup.txt';

module.exports = {

	//Vaule
	'tbNum': 0,
  'menus': [],
  'bills': [],

	// Data Save & Load
	backUp : function(){
		var backupObj = {
			'tbNum': this.tbNum,
			'menus': this.menus,
			'bills': this.bills
		};

		fs.writeFile(backupFile, JSON.stringify(backupObj),'utf8',function(err){
			console.log('backup end');
		});
	},
	restore : function(){
		var data = JSON.parse(fs.readFileSync( backupFile, 'utf8'));

		this.tbNum = data.tbNum;
		this.menus = data.menus;
		this.bills = data.bills;

		console.log('restore end');
	},

	//Data add & edit & del 
	add : function(req,res){
		var type = req.query.type;

		switch(type){
    	case 'menu':
      	this.menus.push({
        	name: req.body.name,
        	price: req.body.price,
        	stock: req.body.stock,
        	max: req.body.max,
        	alcohol: (req.body.alcohol == 'on')? true:false,
        	order: []
      	});

      	res.redirect('/menuList');
      	break;

	  	case 'bill':
	  		var bill = JSON.parse(req.body.obj);
	  				bill.del = [];

  			if(bill.Order.length == 0)
    			res.send(['다시 주문해주세요.','Order?TbNum='+bill.TbNum]);
  			else
  			{
    			var Order = "";
    
   				if(bill.Service)
      			Order += '<b style="font-size:1.3rem">서비스&nbsp;</b>';

    			for(i in bill.Order){
      			Order += bill.Order[i].name +" "+bill.Order[i].num+"<b style='font-size:1.3rem'>&nbsp;|&nbsp;</b>";

      			//해당 메뉴를 찾아 주문 내역 입력
      			for(j in this.menus){
       				if(this.menus[j].name == bill.Order[i].name){
       					bill.del.push({'id':j,'amount': bill.Order[i].num});

       					if( this.menus[j].alcohol )
       						this.menus[j].stock -= bill.Order[i].num;
       					else {
       						this.menus[j].stock -= bill.Order[i].num;
	          			this.menus[j].order.push({
	          				'index': j,
	            			'tbNum': bill.TbNum,
	            			'amount': bill.Order[i].num,
	            			'time': bill.Time
	          			});
          			}
        			} 
						}  
    			}

			    this.bills.push({
			      'tbNum': bill.TbNum,
			      'order': Order,
			      'sum': bill.Sum,
			      'time': bill.Time,
			      'del': bill.del
			    });
			    res.send(['주문접수 되었습니다.','/tfList']);
			   }      	
  	}
	},
	edit : function(req,res){
		var type = req.query.type;
		var id = req.query.id;

	  switch(type){
	    case 'menu':
	      this.menus[id].name = req.body.name;
	      this.menus[id].price = req.body.price;
	      this.menus[id].stock = req.body.stock;
	      this.menus[id].max = req.body.max;
	      this.menus[id].alcohol = (req.body.alcohol == 'on')? true:false;

	      res.redirect('/menuList');       
	      break;
	  }
	},
	del : function(req,res){
		var type = req.query.type;
		var id = req.query.id;

	  switch(type){
	    case 'menu':
	      this.menus.splice(id,1);

	      res.redirect('/menuList');
	      break;
    	case 'bill':
    		var menu = this.menus;
    		var cancel = this.bills[id].del;

    		for( x in cancel )
    			if ( menu[cancel[x].id] != undefined) 
    				menu[cancel[x].id].stock += cancel[x].amount*1;
    		
	      this.bills.splice(id,1);

	      res.redirect('/billList');
	      break;
	    case 'food':
	    	var index = req.query.index;
    		var menu = this.menus;
  		
	    	menu[index].order.splice(id,1);
	    	res.send('정상 처리되었습니다.');
	  }  
	}
}