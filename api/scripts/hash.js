const crypto = require("crypto");

module.exports.hash = payload => {
  var shasum = crypto.createHash("sha1");
  shasum.update(payload, "utf8");
  return shasum.digest("hex");
};
