var express = require("express");
var router = express.Router();
var hyperledger = require("../scripts/hyperledger");

router.get("/", async function(req, res) {
  const companies = await hyperledger.query("mychannel", "airlineMRO", [
    "getCompanies"
  ]);
  console.log(companies);
  res.send(companies);
});

module.exports = router;
