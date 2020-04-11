const express = require("express");
const router = express.Router();
const hyperledger = require("../scripts/hyperledger");

router.get("/", async function(req, res) {
  let companies = await hyperledger.query("mychannel", "airlineMRO", [
    "getCompanies"
  ]);
  console.log(companies);
  res.send(companies);
});

module.exports = router;
