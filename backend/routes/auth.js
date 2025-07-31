const express = require("express");
const router = express.Router();
const User = require("../models/User"); // Importiere dein User-Model

// @route   POST api/auth/login
// @desc    Einloggen oder neuen Benutzer mit Wallet-Adresse registrieren
// @access  Public
router.post("/login", async (req, res) => {
  // Hole die walletAddress aus dem Body der Anfrage
  const { walletAddress } = req.body;

  // Prüfe, ob eine Adresse mitgeschickt wurde
  if (!walletAddress) {
    return res.status(400).json({ msg: "Wallet-Adresse fehlt" });
  }

  try {
    // Suche einen Benutzer mit dieser Adresse (in Kleinbuchstaben)
    let user = await User.findOne({
      walletAddress: walletAddress.toLowerCase(),
    });

    // Fall 1: Benutzer existiert bereits
    if (user) {
      console.log("Benutzer gefunden:", user.walletAddress);
      return res
        .status(200)
        .json({ msg: "Benutzer erfolgreich eingeloggt", user });
    }

    // Fall 2: Benutzer existiert nicht -> neu erstellen
    console.log(
      "Neuer Benutzer wird erstellt für:",
      walletAddress.toLowerCase()
    );

    user = new User({
      walletAddress: walletAddress.toLowerCase(),
      // Hier könntest du Standardwerte für andere Felder setzen
    });

    await user.save(); // Speichere den neuen Benutzer in der DB

    res
      .status(201)
      .json({ msg: "Neuer Benutzer erfolgreich registriert", user });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server-Fehler");
  }
});

module.exports = router;
