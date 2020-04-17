const express = require("express");
const router = express.Router();
const hyperledger = require("../scripts/hyperledger");
const token = require("../scripts/token");

router.get("/", async function(req, res) {
  console.log(req.query.id);
  if (!req.query.id) {
    return res.sendStatus(400);
  }

  //preprocessing
  const ids = req.query.id.split(",");
  let aircraft = [];

  try {
    for (let ii = 0; ii < ids.length; ii++) {
      const aircraftData = await hyperledger.query("mychannel", "airlineMRO", [
        "getAircraft",
        ids[ii]
      ]);
      await new Promise(r => setTimeout(r, 750)); //delay because error would occur when hyperledger is queried too quickly
      aircraft = [...aircraft, aircraftData];
    }
    res.send(aircraft);
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
});

router.post("/", async function(req, res) {
  //validate if admin for the registering company
  try {
    const tokenData = await token.decode(req.headers.authorization);
    //if not authorized admin for company
    if (
      tokenData.type !== "administrator" ||
      tokenData.company.toLowerCase() !== req.body.company.toLowerCase()
    ) {
      return res.sendStatus(401);
    }
  } catch (e) {
    console.log(e);
    return res.sendStatus(401);
  }

  console.log(req.body);
  if (
    Object.keys(req.body).length !== 4 ||
    !req.body.aircraft ||
    !req.body.tailNumber ||
    !req.body.company ||
    !req.body.image
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
      req.body.company,
      req.body.image
    ]);
    res.sendStatus(200);
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
});

router.patch("/", async function(req, res) {
  //validate user
  try {
    const tokenData = await token.decode(req.headers.authorization);
    console.log(tokenData);
    const user = await hyperledger.query("mychannel", "airlineMRO", [
      "checkUser",
      JSON.stringify({
        type: "maintainer",
        username: tokenData.username,
        company: tokenData.company
      })
    ]);

    //if not authorized maintainer for the aircraft throw error
    if (!user.aircraft.includes(req.body.tailNumber)) {
      return res.sendStatus(401);
    }
  } catch (e) {
    console.log(e);
    return res.sendStatus(401);
  }

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
    console.log("replace parts call complete");
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
