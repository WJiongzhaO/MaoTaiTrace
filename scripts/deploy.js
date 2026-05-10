import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { artifacts, network } from "hardhat";

async function main() {
  const { ethers, networkName } = await network.create();

  console.log(`Deploying MoutaiTrace to ${networkName}...`);

  const moutaiTrace = await ethers.deployContract("MoutaiTrace");
  await moutaiTrace.waitForDeployment();

  const address = await moutaiTrace.getAddress();
  console.log(`MoutaiTrace deployed to: ${address}`);

  const artifact = await artifacts.readArtifact("MoutaiTrace");
  const contractInfo = {
    address,
    abi: artifact.abi,
  };

  const currentFile = fileURLToPath(import.meta.url);
  const currentDir = path.dirname(currentFile);
  const projectRoot = path.resolve(currentDir, "..");
  const outputDir = path.join(projectRoot, "frontend", "src", "utils");
  const outputFile = path.join(outputDir, "contractInfo.json");

  await mkdir(outputDir, { recursive: true });
  await writeFile(outputFile, `${JSON.stringify(contractInfo, null, 2)}\n`, "utf8");

  console.log(`Contract ABI and address synced to: ${outputFile}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
