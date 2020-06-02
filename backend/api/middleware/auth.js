const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.authenticateToken = (request, response, next) => {
  const authHeader = request.headers["Authorization"];
  console.log("headers: ", request.headers);
  const token = authHeader.split(" ")[1];
  console.log("token: ", token);
  if (token == null) return response.sendStatus(401);
  jwt.verify(token, process.env.SECRET_KEY, (err, email) => {
    if (err) {
      console.log(err);
      return response.sendStatus(403);
    }
    request.email = email;
    next();
  });
};
