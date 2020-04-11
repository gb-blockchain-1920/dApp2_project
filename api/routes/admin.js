var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
  res.send('getMaintainers endpoint');
});

router.post('/', function(req, res) {
  res.send('assignAircraft endpoint');
});

router.patch('/', function(req, res) {
  res.send('sellAircraft endpoint');
});

module.exports = router;
