// backend/routes/auth.js

const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// HIER: Definiere, welche Wallet-Adressen Admins sind.
// Wichtig: Adressen immer in Kleinbuchstaben eintragen!
const adminWallets = [
  "0x311d4adb2004ccefdb9e39acff59c7b5e4949c2a", // Deine Adresse in Kleinbuchstaben
  // 'eine-weitere-admin-wallet-adresse-falls-noetig'
];

// POST /api/auth/login
router.post("/login", async (req, res) => {
  const { walletAddress } = req.body;

  // Prüfen, ob eine Adresse mitgeschickt wurde
  if (!walletAddress) {
    return res.status(400).json({ msg: "Wallet-Adresse fehlt" });
  }

  try {
    const lowerCaseAddress = walletAddress.toLowerCase();
    let user = await User.findOne({ walletAddress: lowerCaseAddress });

    // Fall 1: Benutzer existiert nicht -> neu erstellen
    if (!user) {
      console.log("Neuer Benutzer wird erstellt für:", lowerCaseAddress);
      user = new User({
        walletAddress: lowerCaseAddress,
      });
      await user.save();
    } else {
      // Fall 2: Benutzer existiert bereits
      console.log("Bestehender Benutzer gefunden:", user.walletAddress);
    }

    // --- Gemeinsame Logik für alle Benutzer (alt und neu) ---
    // Prüfen, ob der gefundene oder neu erstellte Benutzer ein Admin ist
    if (adminWallets.includes(lowerCaseAddress)) {
      // Ja, Admin -> JWT erstellen
      const payload = {
        user: {
          id: user.id,
          address: user.walletAddress,
          isAdmin: true,
        },
      };

      jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: "1d" }, // Ticket ist einen Tag gültig
        (err, token) => {
          if (err) throw err;
          // Schicke das Ticket und die User-Infos zurück
          return res.json({ msg: "Admin erfolgreich eingeloggt", token, user });
        }
      );
    } else {
      // Nein, normaler Benutzer -> Schicke nur User-Infos zurück
      return res.json({ msg: "Benutzer erfolgreich eingeloggt", user });
    }
  } catch (err) {
    // Fange alle Fehler im try-Block ab
    console.error(err);
    res.status(500).send("Server-Fehler");
  }
});

module.exports = router;
