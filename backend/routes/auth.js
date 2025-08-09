const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { protectAdmin } = require("../middleware/auth");
const logger = require("../utils/logger"); // Importiere den Pino-Logger

// Lese die Admin-Wallet-Adresse sicher aus den Umgebungsvariablen.
// Dies ist die einzige Stelle, an der diese Konfiguration vorgenommen wird.
const ADMIN_WALLET_ADDRESS = process.env.ADMIN_WALLET_ADDRESS?.toLowerCase();

// Einmalige Warnung beim Serverstart, falls die Admin-Adresse nicht konfiguriert ist.
if (!ADMIN_WALLET_ADDRESS) {
  logger.warn(
    "Sicherheitswarnung: ADMIN_WALLET_ADDRESS ist in der .env-Datei nicht gesetzt. Es können sich keine Admins einloggen."
  );
}

/**
 * @route   POST /api/auth/login
 * @desc    Loggt einen Benutzer ein oder registriert ihn. Wenn die Adresse eine Admin-Adresse ist, wird ein JWT ausgestellt.
 * @access  Public
 */
router.post("/login", async (req, res) => {
  const { walletAddress } = req.body;

  if (!walletAddress || typeof walletAddress !== "string") {
    return res
      .status(400)
      .json({ msg: "Ungültige oder fehlende Wallet-Adresse." });
  }

  const lowerCaseAddress = walletAddress.toLowerCase();

  try {
    let user = await User.findOne({ walletAddress: lowerCaseAddress });

    if (!user) {
      logger.info(`Neuer Benutzer wird erstellt: ${lowerCaseAddress}`);
      user = new User({ walletAddress: lowerCaseAddress });
      await user.save();
    } else {
      logger.info(`Bestehender Benutzer gefunden: ${lowerCaseAddress}`);
    }

    // Prüfe, ob der Benutzer ein Admin ist.
    if (ADMIN_WALLET_ADDRESS && lowerCaseAddress === ADMIN_WALLET_ADDRESS) {
      const payload = {
        user: {
          id: user.id,
          address: user.walletAddress,
          isAdmin: true,
        },
      };

      // Signiere das Token mit dem geheimen Schlüssel aus der .env-Datei.
      jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: "1d" }, // Token ist einen Tag gültig
        (err, token) => {
          if (err) throw err; // Übergibt den Fehler an den catch-Block
          logger.info(`Admin-Login erfolgreich für: ${lowerCaseAddress}`);
          return res
            .status(200)
            .json({ msg: "Admin erfolgreich eingeloggt", token, user });
        }
      );
    } else {
      // Normaler Benutzer-Login
      return res
        .status(200)
        .json({ msg: "Benutzer erfolgreich eingeloggt", user });
    }
  } catch (err) {
    logger.error(err, `Fehler bei der Login-Anfrage für ${walletAddress}`);
    // Sende eine generische Fehlermeldung, um keine internen Details preiszugeben.
    res.status(500).send("Ein interner Server-Fehler ist aufgetreten.");
  }
});

/**
 * @route   GET /api/auth/me
 * @desc    Gibt die Daten des aktuell eingeloggten Admin-Benutzers zurück, basierend auf einem gültigen Token.
 * @access  Private (geschützt durch protectAdmin Middleware)
 */
router.get("/me", protectAdmin, async (req, res) => {
  try {
    // Die Middleware 'protectAdmin' hat bereits sichergestellt, dass req.user existiert.
    const user = await User.findById(req.user.id).select("-__v"); // Das Feld __v ausschließen

    if (!user) {
      logger.warn(
        `Benutzer mit ID ${req.user.id} aus gültigem Token nicht in DB gefunden.`
      );
      return res.status(404).json({ msg: "Benutzer nicht gefunden." });
    }

    res.status(200).json(user);
  } catch (err) {
    logger.error(err, `Fehler bei der /me Anfrage für User-ID ${req.user.id}`);
    res.status(500).send("Ein interner Server-Fehler ist aufgetreten.");
  }
});

module.exports = router;
