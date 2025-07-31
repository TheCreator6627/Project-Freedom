// backend/routes/auth.js

const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { protectAdmin } = require("../middleware/auth");

// Definiere Admin-Wallets in Kleinbuchstaben
const adminWallets = ["0x311d4adb2004ccefdb9e39acff59c7b5e4949c2a"];

// @route   POST api/auth/login
// @desc    Einloggen oder neuen Benutzer registrieren
router.post("/login", async (req, res) => {
  const { walletAddress } = req.body;
  if (!walletAddress) {
    return res.status(400).json({ msg: "Wallet-Adresse fehlt" });
  }

  try {
    const lowerCaseAddress = walletAddress.toLowerCase();
    let user = await User.findOne({ walletAddress: lowerCaseAddress });

    if (!user) {
      user = new User({ walletAddress: lowerCaseAddress });
      await user.save();
    }

    if (adminWallets.includes(lowerCaseAddress)) {
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
        { expiresIn: "1d" },
        (err, token) => {
          if (err) throw err;
          return res.json({ msg: "Admin erfolgreich eingeloggt", token, user });
        }
      );
    } else {
      return res.json({ msg: "Benutzer erfolgreich eingeloggt", user });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Server-Fehler");
  }
});

// @route   GET api/auth/me
// @desc    Gibt den eingeloggten Benutzer basierend auf dem Token zurück
router.get("/me", protectAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ msg: "Benutzer nicht gefunden" });
    }
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server-Fehler");
  }
});

module.exports = router;
