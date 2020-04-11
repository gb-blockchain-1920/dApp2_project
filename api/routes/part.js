const express = require("express");
const router = express.Router();
const hyperledger = require("../scripts/hyperledger");

router.get("/", async function(req, res) {
  console.log(req.body);
  if (!req.body.partID) {
    return res.sendStatus(400);
  }

  try {
    await hyperledger.invoke("mychannel", "airlineMRO", [
      "getPart",
      req.body.partID.toString()
    ]);
    res.sendStatus(200);
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
});

router.post("/", async function(req, res) {
  console.log(req.body);
  if (
    Object.keys(req.body).length >= 2 ||
    !req.body.description.id ||
    !req.body.description.name ||
    !req.body.maximumHours
  ) {
    return res.sendStatus(400);
  }

  try {
    await hyperledger.invoke("mychannel", "airlineMRO", [
      "newPart",
      JSON.stringify(req.body)
    ]);
    res.sendStatus(200);
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
});

module.exports = router;
