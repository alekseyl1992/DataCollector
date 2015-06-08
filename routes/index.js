var express = require('express');
var router = express.Router();

var data = {};

router.get('/', function(req, res, next) {
    res.render('index');
});

router.get('/api/readAll', function(req, res, next) {
    res.send(data);
});

router.get('/api/write', function(req, res, next) {
    var mac = req.query.mac;
    var temp = req.query.temp;

    data[mac] = {
        temp: temp
    };

    res.send('ok');
});

router.get('/api/clearAll', function(req, res, next) {
    data = {};
});

module.exports = router;
