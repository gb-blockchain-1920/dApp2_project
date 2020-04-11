const express = require("express");
const router = express.Router();
const hyperledger = require("../scripts/hyperledger");

router.get("/", async function(req, res) {
  try {
    const aircraft = await hyperledger.query("mychannel", "airlineMRO", [
      "getAircraft",
      req.body.tailNumber
    ]);
    res.send(aircraft);
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
});

router.post("/", async function(req, res) {
  console.log(req.body);
  if (
    Object.keys(req.body).length !== 3 ||
    !req.body.aircraft ||
    !req.body.tailNumber ||
    !req.body.company
  ) {
    return res.sendStatus(400);
  }
  //pre-processing
  req.body.company = req.body.company.toLowerCase();

  try {
    await hyperledger.invoke("mychannel", "airlineMRO", [
      "registerAircraft",
      req.body.aircraft,
      req.body.tailNumber,
      req.body.company
    ]);
    res.sendStatus(200);
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
});

router.patch("/", async function(req, res) {
  console.log(req.body);
  if (
    Object.keys(req.body).length !== 4 ||
    !req.body.tailNumber ||
    !req.body.type ||
    !req.body.notes
  ) {
    return res.sendStatus(400);
  }

  try {
    //if there are replaced parts, call replace parts function
    if (Object.keys(req.body.replacedParts).length > 0) {
      await hyperledger.invoke("mychannel", "airlineMRO", [
        "replaceParts",
        req.body.tailNumber,
        JSON.stringify(req.body.replacedParts)
      ]);
    }
    //update maintenance
    await hyperledger.invoke("mychannel", "airlineMRO", [
      "performMaintenance",
      req.body.tailNumber,
      req.body.type,
      req.body.notes,
      JSON.stringify(req.body.replacedParts)
    ]);
    res.sendStatus(200);
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
});

module.exports = router;
