const express = require("express");
const router = express.Router();
const hyperledger = require("../scripts/hyperledger");
const token = require("../scripts/token");

router.get("/", async function(req, res) {
  console.log(req.query.id);
  if (!req.query.id) {
    return res.sendStatus(400);
  }

  const ids = req.query.id.split(",");
  let parts = [];

  try {
    for (let ii = 0; ii < ids.length; ii++) {
      const part = await hyperledger.query("mychannel", "airlineMRO", [
        "getPart",
        ids[ii]
      ]);
      await new Promise(r => setTimeout(r, 750)); //delay because error would occur when hyperledger is queried too quickly
      parts = [...parts, part];
    }
    res.send(parts);
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
});

router.post("/", async function(req, res) {
  //validate if maintainer or not
  try {
    const tokenData = await token.decode(req.headers.authorization);
    //if not authorized maintainer for the aircraft throw error
    if (tokenData.type !== "maintainer") {
      return res.sendStatus(401);
    }
  } catch (e) {
    console.log(e);
    return res.sendStatus(401);
  }

  //validate data
  console.log(req.body);
  if (
    Object.keys(req.body).length < 2 ||
    !req.body.description.id ||
    !req.body.description.name ||
    !req.body.maximumHours
  ) {
    return res.sendStatus(400);
  }


  try {
    req.body.maximumHours = Number(req.body.maximumHours); //make sure in number form
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
