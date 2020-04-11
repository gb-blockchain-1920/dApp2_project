var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
  res.send('getPart endpoint');
});

router.post('/', function(req, res) {
  res.send('newPart endpoint');
});

module.exports = router;
