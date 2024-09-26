
# 🚖 **Taxi dApp - Decentralized Payment System** 🚖

## **Project Overview**

Welcome to the **Taxi dApp**, a decentralized application for seamless contactless payments in the taxi industry. This project leverages the **Celo blockchain** and is built using **Next.js** and **Yarn**. The app allows commuters to easily pay taxi drivers using QR codes, making the payment process fast and efficient.

---

### **Project Highlights**

- **Blockchain**: Built on **Celo** to ensure secure, decentralized payments.
- **Smart Contracts**: Contracts deployed on Celo's Alfajores testnet, handling transactions and incentives.
- **Incentives**: Users are rewarded with **0.2 cUSD** after interacting with 2 unique users.
- **QR Code Payments**: Fast and convenient payments using QR code technology.
- **Data Visualization**: Payment and incentive data are fetched and displayed using **The Graph**.

---

## **How to Run the Project**

1. **Clone the Repository**:
    ```bash
    git clone https://github.com/Argusham/TaxiZip.git
    ```
2. **Navigate to the Project Directory**:
    ```bash
    cd packages
    ```
3. **Install Dependencies**:
    ```bash
    yarn install -W
    ```
4. **Start the Development Server**:
    ```bash
    yarn dev
    ```

5. **Compile Smart Contracts**:
    ```bash
    yarn workspace @MiniTest/hardhat compile
    ```

---

### **Smart Contract Addresses**:
- **Contract Address**: `0xAF556F1aecd2b5f2Ce7C83Da9f6B18491ce8eEA4`
- **cUSD Token Address**: `0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1` (Celo Alfajores Testnet)

---

## **Application Features** 🌟

- **Driver Interface**: Generates QR codes for fare amounts.
- **Commuter Interface**: Scans QR codes to complete transactions.
- **Incentive System**: Users receive incentives after multiple interactions.
- **GraphQL Integration**: Retrieve and display payment and incentive data.

---

## **What’s Next?**

- **Split Fare Payments**: A feature allowing commuters to split fares with friends.
- **Daily Driver Report**: Drivers can view their daily earnings and past transactions.

---

## **Pitch Deck & Demo Videos**

- [PowerPoint Presentation Placeholder] 📊
- [Video Demo Placeholder] 🎥

---

## **Get Started Today!**

Fork the repo and start building the future of taxi payments with decentralized technology!

---

## **License**

This project is licensed under the MIT License.
