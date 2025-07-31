// backend/middleware/auth.js

const jwt = require("jsonwebtoken");

const protectAdmin = (req, res, next) => {
  // Hole das Ticket aus dem Authorization-Header
  const authHeader = req.header("Authorization");
  const token = authHeader && authHeader.split(" ")[1]; // Format: "Bearer <token>"

  if (!token) {
    return res.status(401).json({ msg: "Zugriff verweigert. Kein Token." });
  }

  try {
    // Überprüfe das Ticket
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Prüfe, ob das Ticket wirklich für einen Admin ist
    if (!decoded.user.isAdmin) {
      return res
        .status(401)
        .json({ msg: "Zugriff verweigert. Keine Admin-Rechte." });
    }

    // Hänge die Benutzerinfos an die Anfrage, falls später gebraucht
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: "Token ist nicht gültig." });
  }
};

module.exports = { protectAdmin };
