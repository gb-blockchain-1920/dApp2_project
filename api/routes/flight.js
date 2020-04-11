var express = require('express');
var router = express.Router();

router.post('/', function(req, res) {
  res.send('updateFlightHours endpoint');
});

module.exports = router;
