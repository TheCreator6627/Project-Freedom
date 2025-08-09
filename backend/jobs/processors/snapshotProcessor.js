const MerkleRoot = require("../../models/MerkleRoot");
const { generateMerkleTree } = require("../../merkle/generator");
const logger = require("../../utils/logger");

/**
 * Dies ist der Prozessor für Snapshot-Jobs in der BullMQ-Queue.
 * Er empfängt Job-Daten, generiert einen Merkle Tree und speichert das Ergebnis.
 * @param {import('bullmq').Job} job - Das Job-Objekt von BullMQ.
 * @returns {Promise<{root: string, name: string, count: number}>} Das Ergebnis des Jobs.
 */
module.exports = async (job) => {
  const { name, walletAddresses } = job.data;

  // Überprüfen, ob die Job-Daten vollständig sind
  if (!name || !walletAddresses || !Array.isArray(walletAddresses)) {
    throw new Error("Ungültige Job-Daten: Name oder walletAddresses fehlen.");
  }

  logger.info(
    { job: job.id, name, count: walletAddresses.length },
    `Verarbeite Job für Merkle Root "${name}"...`
  );

  try {
    // 1. Merkle Root generieren
    const { root } = generateMerkleTree(walletAddresses);

    // 2. Prüfen, ob ein Root mit diesem Namen bereits existiert, um Duplikate zu verhindern
    const existingRoot = await MerkleRoot.findOne({ name });
    if (existingRoot) {
      const message = `Ein Merkle Root mit dem Namen "${name}" existiert bereits.`;
      logger.warn({ job: job.id, name }, message);
      // Wir werfen keinen Fehler, da der Job aus Adminsicht erledigt ist.
      // Der Admin wollte einen Root mit diesem Namen, und den gibt es.
      return { message, name, root: existingRoot.root };
    }

    // 3. Den neuen Root in der Datenbank speichern
    const newMerkleRoot = new MerkleRoot({
      name,
      root,
      walletAddresses,
    });
    await newMerkleRoot.save();

    logger.info(
      { job: job.id, name },
      `Neuer Merkle Root für "${name}" erfolgreich in der DB gespeichert.`
    );

    // 4. Ein Ergebnis zurückgeben, das im 'completed'-Event des Workers geloggt wird
    return { root, name, count: walletAddresses.length };
  } catch (error) {
    logger.error(
      error,
      `Fehler bei der Verarbeitung von Job ${job.id} für Liste "${name}"`
    );
    // Werfe den Fehler erneut, damit BullMQ ihn als 'failed' markiert
    throw error;
  }
};
