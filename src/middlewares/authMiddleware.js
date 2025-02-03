const jwt = require("jsonwebtoken");
require("dotenv").config();

const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"];

  if (!token) {
    return res.status(403).json({ error: "No token provided" });
  }

  // Mengambil token setelah "Bearer"
  const tokenWithoutBearer = token.split(" ")[1];

  if (!tokenWithoutBearer) {
    return res.status(403).json({ error: "Invalid token format" });
  }

  jwt.verify(tokenWithoutBearer, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    req.user = decoded;  // Menyimpan informasi pengguna yang terdekode
    next();
  });
};

module.exports = verifyToken;
