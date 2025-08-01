const fs = require("fs");
const path = require("path");

// Definiere deine Hauptverträge und ihre Adressen
const contractsConfig = {
  F: "0xe93BCD441452E75D7ED88174a205a9DcCc6FAc36",
  Staking: "0x938C0EAD6aEF71Da9827194C81E6EaDE4D12D273",
  RewardManager: "0x96Febf5384B0C5c2A6800170865bfdE1864c8F0c",
  Treasury: "0xC07a2D56CcD1aaFD23a1611c9a3022E478B6fd0",
  TokenVesting: "0x4FA12941f9A8F3C7ca146c8c3903d9eAba770AEc",
};

// Pfade zu den Ordnern
const artifactsPath = path.resolve(__dirname, "../../build/contracts");
const outputPath = path.resolve(__dirname, "../lib/web3");

function main() {
  let abisContent = `// Diese Datei wird automatisch generiert. Nicht manuell bearbeiten.\n\n`;
  let contractsContent = `// Diese Datei wird automatisch generiert. Nicht manuell bearbeiten.\n\nimport {\n`;

  // Lese jeden Vertrag, extrahiere die ABI und baue die Dateien zusammen
  for (const [name, address] of Object.entries(contractsConfig)) {
    const abiFileName = `${name}.json`;
    const abiFilePath = path.join(artifactsPath, abiFileName);

    if (!fs.existsSync(abiFilePath)) {
      console.error(
        `FEHLER: ABI-Datei für ${name} nicht gefunden unter ${abiFilePath}`
      );
      continue;
    }

    const artifact = JSON.parse(fs.readFileSync(abiFilePath, "utf8"));
    const abi = artifact.abi;
    const abiVariableName = `${
      name.charAt(0).toLowerCase() + name.slice(1)
    }Abi`;

    // Inhalt für abis.ts
    abisContent += `export const ${abiVariableName} = ${JSON.stringify(
      abi,
      null,
      2
    )} as const;\n\n`;

    // Inhalt für contracts.ts
    contractsContent += `  ${abiVariableName},\n`;
  }

  // Fertigstellung von contracts.ts
  contractsContent += `} from './abis';\n\n`;
  contractsContent += `const addresses = {\n`;
  for (const [name, address] of Object.entries(contractsConfig)) {
    contractsContent += `  ${
      name.charAt(0).toLowerCase() + name.slice(1)
    }: '${address}',\n`;
  }
  contractsContent += `} as const;\n\n`;

  for (const name of Object.keys(contractsConfig)) {
    const varName = name.charAt(0).toLowerCase() + name.slice(1);
    contractsContent += `export const ${varName}Contract = {\n`;
    contractsContent += `  address: addresses.${varName},\n`;
    contractsContent += `  abi: ${varName}Abi,\n};\n\n`;
  }

  // Schreibe die finalen Dateien
  fs.writeFileSync(path.join(outputPath, "abis.ts"), abisContent);
  fs.writeFileSync(path.join(outputPath, "contracts.ts"), contractsContent);

  console.log(
    "✅ Vertrags-Informationen erfolgreich aktualisiert in `lib/web3/`"
  );
}

main();
