const hyperledger = require("../scripts/hyperledger");
const express = require("express");
const router = express.Router();
const crypto = require("../scripts/hash");

router.get("/", function(req, res) {
  res.send("checkUser endpoint");
});

router.post("/", async function(req, res) {
  //validate user object
  if (
    Object.keys(req.body).length !== 4 ||
    !req.body.username ||
    !req.body.password ||
    !req.body.type ||
    !req.body.company
  ) {
    return res.sendStatus(400);
  }

  // pre-processing
  req.body.password = crypto.hash(req.body.password); //hash password for storage
  req.body.type = req.body.type.toLowerCase();
  req.body.company = req.body.company.toLowerCase();

  try {
    const response = await hyperledger.query("mychannel", "airlineMRO", [
      "registerUser",
      req.body
    ]);
    res.send(response);
  } catch (e) {
    res.sendStatus(500)
  }
});

module.exports = router;
