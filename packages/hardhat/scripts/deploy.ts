import { ethers } from "hardhat";
import { ContractTransactionResponse } from "ethers";

async function main() {
  // Get the contract factory for the TaxiPayment contract
  const TaxiPayment = await ethers.getContractFactory("TaxiPayment");

  console.log("Deploying the contract...");

  // Deploy the contract
  const taxiPayment = await TaxiPayment.deploy() as any;

  // Wait for the contract to be deployed
  const deployment: ContractTransactionResponse = await taxiPayment.deploymentTransaction();

  await deployment.wait(); // Wait until the transaction is mined

  console.log(`TaxiPayment contract deployed at address: ${taxiPayment.target}`);
}

// Error handling
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
