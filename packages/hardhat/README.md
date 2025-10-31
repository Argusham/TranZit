# TranZit Hardhat Smart Contracts

This is the Hardhat package for the TranZit project, containing smart contracts, deployment scripts, and comprehensive tests for the taxi payment system on Celo blockchain.

## Table of Contents

- [Overview](#overview)
- [Project Structure](#project-structure)
- [Smart Contracts](#smart-contracts)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Setup](#environment-setup)
- [Usage](#usage)
- [Testing](#testing)
- [Deployment](#deployment)
- [Network Configuration](#network-configuration)
- [Scripts](#scripts)
- [Development Workflow](#development-workflow)
- [Troubleshooting](#troubleshooting)

## Overview

TranZit uses smart contracts to facilitate taxi payments on the Celo blockchain using cUSD (Celo Dollar). The system includes:

- **Payment Processing**: Handle payments between passengers and drivers with a 1% platform fee
- **Incentive System**: Reward passengers with 0.1 cUSD for every 2 unique driver interactions
- **Balance Tracking**: Track spending and earning histories for all users
- **Owner Functions**: Administrative functions for managing the incentive pool

## Project Structure

```
packages/hardhat/
├── contracts/               # Smart contracts
│   ├── ImprovedTaxiPayment.sol   # Main TaxiPaymentcUSD contract
│   └── MockERC20.sol             # Mock ERC20 token for testing
├── scripts/                 # Deployment and utility scripts
│   └── taxiPayment.ts            # Deployment script for TaxiPaymentcUSD
├── test/                    # Test files
│   ├── Lock.ts                   # Sample test (can be removed)
│   └── TaxiPayment.test.ts       # Comprehensive tests for TaxiPaymentcUSD
├── typechain-types/         # Auto-generated TypeScript types for contracts
├── artifacts/               # Compiled contract artifacts
├── cache/                   # Hardhat cache
├── hardhat.config.ts        # Hardhat configuration
├── package.json             # Project dependencies
├── tsconfig.json            # TypeScript configuration
├── .env.example             # Environment variable template
├── .env                     # Environment variables (not in git)
└── .gitignore               # Git ignore rules
```

## Smart Contracts

### TaxiPaymentcUSD (ImprovedTaxiPayment.sol)

The main contract handling all taxi payment logic.

**Key Features:**
- **1% Platform Fee**: Automatically deducts 1% from each payment as a tax
- **Incentive Rewards**: Awards 0.1 cUSD for every 2 unique driver interactions
- **Balance Tracking**: Maintains spending and receiving history for all users
- **Owner Controls**: Administrative functions for fund management

**Contract Functions:**

```solidity
// Public Functions
payUser(address driver, uint amount)              // Make a payment to a driver
getUserBalances(address userAddr)                 // View user's spent and received balances

// Owner Functions
depositIncentivePool(uint amount)                 // Deposit funds for incentive pool
withdrawFunds(uint amount)                        // Withdraw funds from contract

// View Functions
owner()                                           // Get contract owner
cUSDToken()                                       // Get cUSD token address
TAX_PERCENT()                                     // Get tax percentage (1%)
INCENTIVE_TRIGGER()                               // Get incentive trigger (2 unique users)
INCENTIVE_AMOUNT()                                // Get incentive amount (0.1 cUSD)
```

**Contract Details:**
- **Location**: `contracts/ImprovedTaxiPayment.sol`
- **Solidity Version**: ^0.8.0
- **Network**: Celo Mainnet & Alfajores Testnet
- **cUSD Token**: Uses Celo's native cUSD stablecoin

### MockERC20 (MockERC20.sol)

A simple ERC20 token implementation used exclusively for testing.

**Features:**
- Standard ERC20 functions (transfer, approve, transferFrom)
- Mint function for test token generation
- Used in test suite to simulate cUSD

**Location**: `contracts/MockERC20.sol`

## Prerequisites

- **Node.js**: v18 or higher
- **npm** or **yarn**: Package manager
- **Celo Wallet**: Private key for deployment
- **Celoscan API Key**: For contract verification (optional)

## Installation

1. Clone the repository and navigate to the hardhat package:
```bash
cd packages/hardhat
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Install Hardhat globally (optional):
```bash
npm install -g hardhat
```

## Environment Setup

1. Copy the example environment file:
```bash
cp .env.example .env
```

2. Edit `.env` and add your credentials:
```env
PRIVATE_KEY=your_wallet_private_key_here
CELOSCAN_API_KEY=your_celoscan_api_key_here
```

**Important Security Notes:**
- Never commit your `.env` file to version control
- Keep your private key secure and never share it
- Use a dedicated wallet for deployment with only necessary funds
- The `.env` file is already in `.gitignore`

**Getting Credentials:**
- **Private Key**: Export from MetaMask, Valora, or your Celo wallet
- **Celoscan API Key**: Get from [Celoscan](https://celoscan.io/myapikey)

## Usage

### Compile Contracts

Compile all smart contracts:
```bash
npx hardhat compile
```

This will:
- Compile Solidity contracts in the `contracts/` directory
- Generate artifacts in `artifacts/`
- Generate TypeScript types in `typechain-types/`

### Clean Build Artifacts

Remove compilation artifacts and cache:
```bash
npx hardhat clean
```

### Start Local Node

Run a local Hardhat network node:
```bash
npx hardhat node
```

## Testing

### Run All Tests

Execute the complete test suite:
```bash
npx hardhat test
```

### Run Specific Test File

Run only the TaxiPayment tests:
```bash
npx hardhat test test/TaxiPayment.test.ts
```

### Run Tests with Gas Reporter

Enable gas usage reporting:
```bash
REPORT_GAS=true npx hardhat test
```

### Test Coverage

Generate test coverage report:
```bash
npx hardhat coverage
```

### Test Suite Overview

The test suite (`test/TaxiPayment.test.ts`) includes 27 comprehensive tests covering:

**Deployment Tests (3 tests)**
- Contract initialization
- Owner assignment
- Constant values

**Payment Functionality (7 tests)**
- Successful payments
- Tax collection (1%)
- Driver payment receipt (99%)
- Error handling (zero amount, insufficient balance, self-payment, insufficient allowance)

**Incentive System (5 tests)**
- Unique driver interaction tracking
- Incentive awards after 2 unique interactions
- Multiple incentive awards
- Duplicate prevention
- Incentive tracking accuracy

**Owner Functions (5 tests)**
- Incentive pool deposits
- Fund withdrawals
- Access control
- Withdrawal limits

**Balance Tracking (3 tests)**
- Spent balance tracking
- Received balance tracking
- New user initialization

**Edge Cases & Integration (4 tests)**
- Multiple passengers, same driver
- Small and large payment amounts
- Consecutive payments with incentives

## Deployment

### Deploy to Alfajores Testnet

```bash
npx hardhat run scripts/taxiPayment.ts --network alfajores
```

**Before deploying to testnet:**
1. Get testnet CELO from [Celo Faucet](https://faucet.celo.org/)
2. Ensure your wallet has enough CELO for gas fees
3. The script uses Alfajores cUSD: `0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1`

### Deploy to Celo Mainnet

```bash
npx hardhat run scripts/taxiPayment.ts --network celo
```

**Before deploying to mainnet:**
1. Ensure you have real CELO for gas fees
2. Double-check contract code and configuration
3. Consider getting a security audit
4. The script uses Mainnet cUSD: `0x765DE816845861e75A25fCA122bb6898B8B1282a`

### Verify Contract on Celoscan

After deployment, verify your contract:
```bash
npx hardhat verify --network alfajores DEPLOYED_CONTRACT_ADDRESS "CUSD_TOKEN_ADDRESS"
```

Example:
```bash
npx hardhat verify --network alfajores 0x123...abc "0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1"
```

## Network Configuration

The project is configured for Celo networks (see `hardhat.config.ts`):

### Alfajores Testnet
- **Chain ID**: 44787
- **RPC URL**: https://alfajores-forno.celo-testnet.org
- **Block Explorer**: https://alfajores.celoscan.io
- **cUSD Token**: `0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1`
- **Faucet**: https://faucet.celo.org/

### Celo Mainnet
- **Chain ID**: 42220
- **RPC URL**: https://forno.celo.org
- **Block Explorer**: https://celoscan.io
- **cUSD Token**: `0x765DE816845861e75A25fCA122bb6898B8B1282a`

### Local Network (Default)
- **Chain ID**: 31337
- **RPC URL**: http://127.0.0.1:8545
- **Use for development and testing**

## Scripts

### taxiPayment.ts

Deployment script for the TaxiPaymentcUSD contract.

**Location**: `scripts/taxiPayment.ts`

**What it does:**
1. Gets the contract factory for TaxiPaymentcUSD
2. Deploys the contract with cUSD token address
3. Waits for deployment confirmation
4. Logs the deployed contract address

**Usage:**
```bash
# Local deployment
npx hardhat run scripts/taxiPayment.ts

# Testnet deployment
npx hardhat run scripts/taxiPayment.ts --network alfajores

# Mainnet deployment
npx hardhat run scripts/taxiPayment.ts --network celo
```

**Customization:**
To deploy with a different token address, modify line 9 in the script:
```typescript
const cUSDTokenAddress = "YOUR_TOKEN_ADDRESS";
```

## Development Workflow

### For New Developers

1. **Setup Environment**
   ```bash
   cd packages/hardhat
   npm install
   cp .env.example .env
   # Edit .env with your credentials
   ```

2. **Compile Contracts**
   ```bash
   npx hardhat compile
   ```

3. **Run Tests**
   ```bash
   npx hardhat test
   ```

4. **Make Changes**
   - Edit contracts in `contracts/`
   - Update tests in `test/`
   - Modify scripts in `scripts/`

5. **Test Changes**
   ```bash
   npx hardhat test
   ```

6. **Deploy Locally**
   ```bash
   # Terminal 1: Start local node
   npx hardhat node

   # Terminal 2: Deploy
   npx hardhat run scripts/taxiPayment.ts --network localhost
   ```

7. **Deploy to Testnet**
   ```bash
   npx hardhat run scripts/taxiPayment.ts --network alfajores
   ```

### Best Practices

1. **Always Test First**: Run tests before deploying
2. **Use Testnet**: Deploy to Alfajores before mainnet
3. **Verify Contracts**: Verify on Celoscan after deployment
4. **Security**: Never commit private keys or `.env` files
5. **Gas Optimization**: Monitor gas usage with `REPORT_GAS=true`
6. **Documentation**: Update README when adding features
7. **Version Control**: Commit frequently with clear messages

### Adding New Features

1. **Add Contract Logic**
   - Edit `contracts/ImprovedTaxiPayment.sol`
   - Follow existing code style

2. **Write Tests**
   - Add tests to `test/TaxiPayment.test.ts`
   - Ensure 100% coverage of new features

3. **Update Scripts** (if needed)
   - Modify `scripts/taxiPayment.ts` for deployment changes

4. **Compile & Test**
   ```bash
   npx hardhat compile
   npx hardhat test
   ```

5. **Document Changes**
   - Update this README
   - Add code comments

## Troubleshooting

### Common Issues

**Issue: `Error: PRIVATE_KEY is not set`**
- **Solution**: Ensure `.env` file exists with valid `PRIVATE_KEY`

**Issue: `Error: Insufficient funds for gas`**
- **Solution**: Add CELO to your wallet from faucet (testnet) or exchange (mainnet)

**Issue: `Error: Network not found`**
- **Solution**: Check network name in command matches `hardhat.config.ts` (use `alfajores` or `celo`)

**Issue: `Error: Transaction reverted`**
- **Solution**: Check contract logic, ensure cUSD token address is correct

**Issue: Contract verification fails**
- **Solution**: Ensure CELOSCAN_API_KEY is set, use exact constructor arguments

**Issue: Tests fail with timeout**
- **Solution**: Increase timeout in test or check for infinite loops

**Issue: `Error: Contract already deployed`**
- **Solution**: Use a different wallet or deploy to different network

### Getting Help

- Check [Hardhat Documentation](https://hardhat.org/docs)
- Visit [Celo Documentation](https://docs.celo.org)
- Review [OpenZeppelin Contracts](https://docs.openzeppelin.com/contracts)
- Check project issues and discussions

## Dependencies

### Core Dependencies
- **@nomicfoundation/hardhat-ethers**: Ethers.js integration
- **@openzeppelin/contracts**: Secure smart contract library
- **ethers**: Ethereum library for JavaScript
- **dotenv**: Environment variable management

### Development Dependencies
- **hardhat**: Ethereum development environment
- **@nomicfoundation/hardhat-toolbox**: Hardhat plugins bundle
- **@nomicfoundation/hardhat-chai-matchers**: Testing assertions
- **@nomicfoundation/hardhat-verify**: Contract verification
- **hardhat-gas-reporter**: Gas usage reporting
- **solidity-coverage**: Test coverage analysis
- **typechain**: TypeScript types for contracts
- **chai**: Testing library
- **ts-node**: TypeScript execution
- **typescript**: TypeScript compiler

See `package.json` for complete list and versions.

## Contract Addresses

### Alfajores Testnet
- **TaxiPaymentcUSD**: *Deploy and add address here*
- **cUSD Token**: `0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1`

### Celo Mainnet
- **TaxiPaymentcUSD**: *Deploy and add address here*
- **cUSD Token**: `0x765DE816845861e75A25fCA122bb6898B8B1282a`

## License

This project is part of the TranZit application.

## Additional Resources

- [Hardhat Documentation](https://hardhat.org/docs)
- [Celo Developer Docs](https://docs.celo.org)
- [Ethers.js Documentation](https://docs.ethers.org)
- [OpenZeppelin Documentation](https://docs.openzeppelin.com)
- [Solidity Documentation](https://docs.soliditylang.org)
- [Celoscan](https://celoscan.io)

---

**Need Help?** Open an issue or contact the development team.

**Contributing?** Please read the project contribution guidelines before submitting PRs.
