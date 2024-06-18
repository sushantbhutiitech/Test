const jwt = require("jsonwebtoken");

const issueJWT = (id) => {
  const _id = id;

  const payload = {
    sub: _id,
    // iat: Date.now(),this was the culprit in expiring token 
  };
  const expiresIn="1h"

  const signedToken = jwt.sign(payload, "bhumi_community", { expiresIn: expiresIn });

  return {
    token: "Bearer " + signedToken,
  };
};
module.exports = issueJWT;
