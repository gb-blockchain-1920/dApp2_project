var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
  res.send('getAircraft endpoint');
});

router.post('/', function(req, res) {
  res.send('registerAircraft endpoint');
});

router.patch('/', function(req, res) {
  res.send('performMaintenance + replaceParts endpoint');
});

module.exports = router;
