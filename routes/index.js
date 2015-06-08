var express = require('express');
var router = express.Router();

var data = {test: {temp: 20.2}};

router.get('/', function(req, res, next) {
    res.render('index');
});

router.get('/api/readAll', function(req, res, next) {
    res.send(data);
});

router.post('/api/write', function(req, res, next) {
    var mac = req.body.mac;
    var temp = req.body.temp;

    data[mac] = temp;

    res.send('ok');
});

module.exports = router;
