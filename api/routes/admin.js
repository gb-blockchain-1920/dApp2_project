var express = require("express");
var router = express.Router();
const hyperledger = require("../scripts/hyperledger");

router.get("/", async function(req, res) {
  console.log(req.body);
  if (Object.keys(req.body).length !== 1 || !req.body.company) {
    return res.sendStatus(400);
  }

  try {
    const maintainers = await hyperledger.query("mychannel", "airlineMRO", [
      "getMaintainers",
      req.body.company
    ]);
    res.send(maintainers);
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
});

router.post("/", async function(req, res) {
  if (
    Object.keys(req.body).length !== 3 ||
    !req.body.username ||
    !req.body.tailNumber ||
    !req.body.company
  ) {
    return res.sendStatus(400);
  }

  try {
    await hyperledger.invoke("mychannel", "airlineMRO", [
      "assignAircraft",
      req.body.username,
      req.body.tailNumber,
      req.body.company
    ]);
    res.send(200);
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
});

router.patch("/", async function(req, res) {
  if (
    Object.keys(req.body).length !== 2 ||
    !req.body.company ||
    !req.body.tailNumber
  ) {
    return res.sendStatus(400);
  }

  try {
    await hyperledger.invoke("mychannel", "airlineMRO", [
      "sellAircraft",
      req.body.tailNumber,
      req.body.company
    ]);
    res.send(200);
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
});

module.exports = router;
