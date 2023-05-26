const jwt = require("jsonwebtoken");
const secret = require("../config/secret");

module.exports = async (req, res, next) => {
  /*
    IMPLEMENT

    1- On valid token in the Authorization header, call next.

    2- On missing token in the Authorization header,
      the response body should include a string exactly as follows: "token required".

    3- On invalid or expired token in the Authorization header,
      the response body should include a string exactly as follows: "token invalid".
  */
  const token = req.headers.authorization;
try{
if (token) {
  jwt.verify(token, secret.jwtSecret, (err, decodedToken) => {
    if (err) {
      res.status(401).json("token invalid");
    } else {
      req.decodedJwt = decodedToken;
      next();
    }
  });
} else {
  res.status(401).json("token required");
}
}catch(err){
  next(err)
}
}
//   if (token) {
//      jwt.verify(token, secret.jwtSecret, (err, decodedToken) => {
//       if (err) {
//          res.status(401).json("token invalid");
//       } else {
//        req.decodedJwt =  decodedToken;
//         next();
//       }
//     });
//   } else {
//    res.status(401).json("token required");
//   }
// };
