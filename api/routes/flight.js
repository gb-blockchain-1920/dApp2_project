const express = require("express");
const router = express.Router();
const hyperledger = require("../scripts/hyperledger");
const token = require("../scripts/token");

router.post("/", async function(req, res) {
  //validate user
  try {
    const tokenData = await token.decode(req.headers.authorization);
    console.log(tokenData);
    const user = await hyperledger.query("mychannel", "airlineMRO", [
      "checkUser",
      JSON.stringify({type: "maintainer", username: tokenData.username, company: tokenData.company})
    ]);

    //if not authorized maintainer for the aircraft throw error
    if (!user.aircraft.includes(req.body.tailNumber)) {
      return res.sendStatus(401)
    }
  } catch (e) {
    console.log(e);
    return res.sendStatus(401);
  }

  //validate data
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
