var jwt = require("jsonwebtoken");
var env = require("./env");

module.exports.decode = authHeader => {
  const token = authHeader.split(" ").slice(-1)[0];
  return jwt.verify(token, env.jwtKey);
};

module.exports.encode = body => {
  return jwt.sign(body, env.jwtKey, { expiresIn: "10hr" });
}
