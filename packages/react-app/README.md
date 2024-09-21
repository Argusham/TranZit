# Taxi Payment DApp

A decentralized application built on the Celo Alfajores Testnet. This DApp facilitates contactless payments between taxi drivers and commuters using cUSD, a Celo stable coin.

## Tech Stack
- Frontend: React, Tailwind CSS
- Blockchain: Celo Alfajores Testnet
- Smart Contract Interaction: Viem, Solidity

## Key Features
1. **Send Payments**: Enables users to send cUSD payments to other addresses.
2. **View User Balances**: Displays the amount spent and received by users.
3. **Contract Info**: Fetches tax percentage, incentive amounts, and incentive triggers.

## Requirements
- **Node.js** and **npm**
- **MetaMask** with Celo Alfajores Testnet
- **Hardhat** for contract deployment

## Setup
1. Clone the repo:  
   `git clone https://github.com/yourusername/taxi-payment-dapp.git`
   
2. Install dependencies:  
   `npm install`

3. Configure Tailwind CSS:  
   `npx tailwindcss init`

4. Add the Alfajores network to MetaMask:  
   RPC URL: `https://alfajores-forno.celo-testnet.org`  
   Chain ID: `44787`

5. Run the DApp:  
   `npm start`

6. Deploy the contract using Hardhat:  
   `npx hardhat run scripts/deploy.ts --network alfajores`

## Project Structure
- `src/components/`: Reusable UI components.
- `src/hooks/`: Contains custom hooks like `useTaxiPayment.ts` for blockchain interactions.
- `src/pages/`: Main page (index.tsx) where the DApp UI is rendered.

## License
MIT
