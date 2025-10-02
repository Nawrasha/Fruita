const jwt = require("jsonwebtoken");
const secretKey = "ezalqikjdsqjhdaziedjhazoqdhjsiuehazoid";


function authMiddleware(req, res, next) {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.status(401).json({ message: "No token provided" });

  const token = authHeader.split(" ")[1]; // Expect "Bearer <token>"
  if (!token) return res.status(401).json({ message: "Invalid token format" });

  try {
    const decoded = jwt.verify(token, secretKey);
    req.user = decoded.user;
    next();
  } catch {
    res.status(403).json({ message: "Invalid or expired token" });
  }
}

module.exports = authMiddleware;