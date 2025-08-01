const fs = require("fs");
const path = require("path");

// Definiere deine Hauptverträge und ihre Adressen (dieselbe Liste wie im Frontend)
const contractsConfig = {
  F: "0xe93BCD441452E75D7ED88174a205a9DcCcCc6FAc36",
  Staking: "0x938C0EAD6aEF71Da9827194C81E6EaDE4D12D273",
  RewardManager: "0x96Febf5384B0C5c2A6800170865bfdE1864c8F0c",
  Treasury: "0xC07a2D56CcD1aaFD23a1611c9a3022E478B6fd0",
  TokenVesting: "0x4FA12941f9A8F3C7ca146c8c3903d9eAba770AEc",
};

// Pfade zu den Ordnern
const artifactsPath = path.resolve(__dirname, "../../build/contracts");
const outputPath = path.resolve(__dirname, "../lib"); // Ausgabe in backend/lib/

function main() {
  let content = `// Diese Datei wird automatisch generiert. Nicht manuell bearbeiten.\n\n`;
  content += `const contracts = {\n`;

  for (const [name, address] of Object.entries(contractsConfig)) {
    const abiFilePath = path.join(artifactsPath, `${name}.json`);

    if (!fs.existsSync(abiFilePath)) {
      console.error(`FEHLER: ABI-Datei für ${name} nicht gefunden.`);
      continue;
    }

    const artifact = JSON.parse(fs.readFileSync(abiFilePath, "utf8"));
    const abi = artifact.abi;

    content += `  ${name}: {\n`;
    content += `    address: '${address}',\n`;
    content += `    abi: ${JSON.stringify(abi, null, 2)},\n`;
    content += `  },\n`;
  }

  content += `};\n\nmodule.exports = contracts;\n`;

  // Stelle sicher, dass der lib-Ordner existiert
  if (!fs.existsSync(outputPath)) {
    fs.mkdirSync(outputPath);
  }

  fs.writeFileSync(path.join(outputPath, "contracts.js"), content);
  console.log(
    "✅ Vertrags-Informationen für das Backend erfolgreich aktualisiert in `lib/contracts.js`"
  );
}

main();
