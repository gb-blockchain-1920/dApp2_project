const express = require("express");
const router = express.Router();
const hyperledger = require("../scripts/hyperledger");

router.post("/", async function(req, res) {
  if (
    (Object.keys(req.body).length !== 2 || !req.body.tailNumber,
    !req.body.hours)
  ) {
    return res.sendStatus(400);
  }

  try {
    await hyperledger.invoke("mychannel", "airlineMRO", [
      "updateFlightHours",
      req.body.tailNumber,
      req.body.hours.toString()
    ]);
    res.sendStatus(200);
  } catch (e) {
    console.log(e);
    res.sendStatus(500)
  }
});

module.exports = router;
