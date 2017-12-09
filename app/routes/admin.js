var express = require('express');
var router = express.Router();

const adminCtrl = require('../controllers/admin.js');

/* GET Menu list. */
router.get('/menus', function(req, res, next) {
  adminCtrl.getMenuList(function (data) {
      res.render('admin/menus',{items:data});
  });
});

router.get('/menus/edit/:id', function(req, res, next) {
    adminCtrl.getMenu(req.params.id,function (data) {
        res.render('admin/edit',data);
    });
});

router.get('/menus/add', function(req, res, next) {
    res.render('admin/add');
});

// Add Menu
router.put('/menus', function(req, res, next) {
    adminCtrl.addMenu(req.body, function (result) {
        if(result) res.status(200).send();
        else res.status(403).send();
    });
});

// Edit Menu
router.post('/menus', function(req, res, next) {
    adminCtrl.editMenu(req.body, function (result) {
        if(result) res.status(200).send();
        else res.status(403).send();
    });
});

// Del Menu
router.delete('/menus', function(req, res, next) {
    adminCtrl.removeMenu(req.body, function (result) {
        if(result) res.status(200).send();
        else res.status(403).send();
    });
});

// GET table num
router.get('/table', function(req, res, next) {
    adminCtrl.getTableNum(function (rtn) {
        res.json(rtn);
    });
});

// Update table num
router.put('/table', function(req, res, next) {
    const num = req.body.tnum;

    adminCtrl.setTableNum(num,function(result){
      if(result) res.status(200).send();
      else res.status(403).send();
    });
});


module.exports = router;
