const jwt = require('jsonwebtoken');
require('dotenv').config();

const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader?.split(' ')[1];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.sendStatus(403);
    req.user = decoded; // Add decoded user to request
    next();
  });
};

const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  try {
    const decoded = jwt.verify(token, SECRET);
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
};

const authorize = (req, res,next) => {
  const token = req.cookies.token
  if (!token) return res.status(401).json({ message: "Invalid token" });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    if(decoded.role === "RESPONSABLE" || decoded.role === "VISITEUR" || decoded.role === "GESTIONNAIRE" || decoded.role === "ADMIN") {
      req.user = decoded;
      req.role = decoded.role
    }else {
      return res.status(403).json({ message: "Forbidden: not a user" });
    }
    next()
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};


module.exports = {authorize};
