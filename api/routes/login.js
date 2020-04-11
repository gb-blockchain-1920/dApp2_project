var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
  res.send('checkUser endpoint');
});

router.post('/', function(req, res) {
  res.send('registerUser endpoint');
});

module.exports = router;
