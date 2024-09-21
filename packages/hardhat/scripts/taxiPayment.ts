import { ethers } from "hardhat";
import { ContractTransactionResponse } from "ethers";

async function main() {
  // Get the contract factory for the TaxiPaymentcUSD contract
  const TaxiPaymentcUSD = await ethers.getContractFactory("TaxiPaymentcUSD");

  // Specify the cUSD token address for the Celo Alfajores testnet
  const cUSDTokenAddress = "0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1"; // Celo Alfajores cUSD token address

  console.log("Deploying the TaxiPaymentcUSD contract...");

  // Deploy the contract with the cUSD token address as a constructor argument
  const taxiPayment = await TaxiPaymentcUSD.deploy(cUSDTokenAddress) as any;

  // Wait for the contract to be deployed
  const deployment: ContractTransactionResponse = await taxiPayment.deploymentTransaction();

  await deployment.wait(); // Wait until the transaction is mined

  console.log(`TaxiPaymentcUSD contract deployed at address: ${taxiPayment.target}`);
}

// Error handling
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
