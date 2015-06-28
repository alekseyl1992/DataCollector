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
    var time = new Date();

    data[mac] = {
        temp: temp,
        time: time
    };

    res.send('ok');
});

router.get('/api/clearAll', function(req, res, next) {
    data = {};
    res.send('ok');
});

module.exports = router;
