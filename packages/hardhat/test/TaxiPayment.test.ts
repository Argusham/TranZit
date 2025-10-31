import { expect } from "chai";
import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";

describe("TaxiPaymentcUSD Contract", function () {
  let taxiPayment: any;
  let mockToken: any;
  let owner: SignerWithAddress;
  let driver: SignerWithAddress;
  let passenger: SignerWithAddress;
  let driver2: SignerWithAddress;
  let driver3: SignerWithAddress;

  const INITIAL_SUPPLY = ethers.parseEther("10000"); // 10,000 cUSD
  const PAYMENT_AMOUNT = ethers.parseEther("100"); // 100 cUSD
  const INCENTIVE_AMOUNT = ethers.parseEther("0.1"); // 0.1 cUSD

  beforeEach(async function () {
    // Get signers
    [owner, driver, passenger, driver2, driver3] = await ethers.getSigners();

    // Deploy MockERC20 token
    const MockERC20Factory = await ethers.getContractFactory("MockERC20");
    mockToken = await MockERC20Factory.deploy("Mock cUSD", "cUSD", INITIAL_SUPPLY);
    await mockToken.waitForDeployment();

    // Deploy TaxiPaymentcUSD contract
    const TaxiPaymentFactory = await ethers.getContractFactory("TaxiPaymentcUSD");
    taxiPayment = await TaxiPaymentFactory.deploy(await mockToken.getAddress());
    await taxiPayment.waitForDeployment();

    // Transfer tokens to passenger for testing
    await mockToken.transfer(passenger.address, ethers.parseEther("1000"));

    // Transfer tokens to contract for incentive pool
    await mockToken.transfer(await taxiPayment.getAddress(), ethers.parseEther("100"));
  });

  describe("Deployment", function () {
    it("Should deploy with correct cUSD token address", async function () {
      expect(await taxiPayment.cUSDToken()).to.equal(await mockToken.getAddress());
    });

    it("Should set the correct owner", async function () {
      expect(await taxiPayment.owner()).to.equal(owner.address);
    });

    it("Should have correct constants", async function () {
      expect(await taxiPayment.TAX_PERCENT()).to.equal(1);
      expect(await taxiPayment.INCENTIVE_TRIGGER()).to.equal(2);
      expect(await taxiPayment.INCENTIVE_AMOUNT()).to.equal(INCENTIVE_AMOUNT);
    });
  });

  describe("Payment Functionality", function () {
    it("Should allow passenger to pay driver", async function () {
      // Approve contract to spend tokens
      await mockToken.connect(passenger).approve(await taxiPayment.getAddress(), PAYMENT_AMOUNT);

      // Make payment
      await expect(taxiPayment.connect(passenger).payUser(driver.address, PAYMENT_AMOUNT))
        .to.emit(taxiPayment, "PaymentMade")
        .withArgs(passenger.address, driver.address, PAYMENT_AMOUNT);

      // Check balances
      const [spent] = await taxiPayment.getUserBalances(passenger.address);
      expect(spent).to.equal(PAYMENT_AMOUNT);

      const [, driverReceived] = await taxiPayment.getUserBalances(driver.address);
      const expectedReceivedAmount = PAYMENT_AMOUNT - (PAYMENT_AMOUNT * 1n / 100n); // 99 cUSD
      expect(driverReceived).to.equal(expectedReceivedAmount);
    });

    it("Should collect 1% tax on payments", async function () {
      const contractBalanceBefore = await mockToken.balanceOf(await taxiPayment.getAddress());

      await mockToken.connect(passenger).approve(await taxiPayment.getAddress(), PAYMENT_AMOUNT);
      await taxiPayment.connect(passenger).payUser(driver.address, PAYMENT_AMOUNT);

      const contractBalanceAfter = await mockToken.balanceOf(await taxiPayment.getAddress());
      const expectedTax = PAYMENT_AMOUNT * 1n / 100n; // 1 cUSD

      expect(contractBalanceAfter - contractBalanceBefore).to.equal(expectedTax);
    });

    it("Should transfer correct amount to driver (99% of payment)", async function () {
      const driverBalanceBefore = await mockToken.balanceOf(driver.address);

      await mockToken.connect(passenger).approve(await taxiPayment.getAddress(), PAYMENT_AMOUNT);
      await taxiPayment.connect(passenger).payUser(driver.address, PAYMENT_AMOUNT);

      const driverBalanceAfter = await mockToken.balanceOf(driver.address);
      const expectedAmount = PAYMENT_AMOUNT - (PAYMENT_AMOUNT * 1n / 100n); // 99 cUSD

      expect(driverBalanceAfter - driverBalanceBefore).to.equal(expectedAmount);
    });

    it("Should fail if payment amount is 0", async function () {
      await mockToken.connect(passenger).approve(await taxiPayment.getAddress(), PAYMENT_AMOUNT);

      await expect(taxiPayment.connect(passenger).payUser(driver.address, 0))
        .to.be.revertedWith("Payment must be greater than 0");
    });

    it("Should fail if passenger has insufficient balance", async function () {
      const excessiveAmount = ethers.parseEther("10000");
      await mockToken.connect(passenger).approve(await taxiPayment.getAddress(), excessiveAmount);

      await expect(taxiPayment.connect(passenger).payUser(driver.address, excessiveAmount))
        .to.be.revertedWith("Insufficient cUSD balance");
    });

    it("Should fail if passenger tries to pay themselves", async function () {
      await mockToken.connect(passenger).approve(await taxiPayment.getAddress(), PAYMENT_AMOUNT);

      await expect(taxiPayment.connect(passenger).payUser(passenger.address, PAYMENT_AMOUNT))
        .to.be.revertedWith("Cannot pay yourself");
    });

    it("Should fail if allowance is insufficient", async function () {
      // Don't approve or approve less than needed
      await mockToken.connect(passenger).approve(await taxiPayment.getAddress(), ethers.parseEther("10"));

      await expect(taxiPayment.connect(passenger).payUser(driver.address, PAYMENT_AMOUNT))
        .to.be.reverted;
    });
  });

  describe("Incentive System", function () {
    it("Should track unique driver interactions", async function () {
      await mockToken.connect(passenger).approve(await taxiPayment.getAddress(), PAYMENT_AMOUNT * 3n);

      // Pay same driver twice
      await taxiPayment.connect(passenger).payUser(driver.address, PAYMENT_AMOUNT);
      await taxiPayment.connect(passenger).payUser(driver.address, PAYMENT_AMOUNT);

      // Pay different driver once
      await taxiPayment.connect(passenger).payUser(driver2.address, PAYMENT_AMOUNT);

      // Check that passenger has interacted with 2 unique drivers
      const userInfo = await taxiPayment.users(passenger.address);
      expect(userInfo.uniqueUserCount).to.equal(2);
    });

    it("Should award incentive after 2 unique driver interactions", async function () {
      const passengerBalanceBefore = await mockToken.balanceOf(passenger.address);

      await mockToken.connect(passenger).approve(await taxiPayment.getAddress(), PAYMENT_AMOUNT * 2n);

      // Pay first driver
      await taxiPayment.connect(passenger).payUser(driver.address, PAYMENT_AMOUNT);

      // Pay second driver - should trigger incentive
      await expect(taxiPayment.connect(passenger).payUser(driver2.address, PAYMENT_AMOUNT))
        .to.emit(taxiPayment, "IncentiveAwarded")
        .withArgs(passenger.address, INCENTIVE_AMOUNT);

      // Check that passenger received incentive
      const passengerBalanceAfter = await mockToken.balanceOf(passenger.address);
      const expectedBalance = passengerBalanceBefore - (PAYMENT_AMOUNT * 2n) + INCENTIVE_AMOUNT;

      expect(passengerBalanceAfter).to.equal(expectedBalance);
    });

    it("Should award multiple incentives for every 2 unique interactions", async function () {
      await mockToken.connect(passenger).approve(await taxiPayment.getAddress(), PAYMENT_AMOUNT * 4n);

      // Pay 4 different drivers
      await taxiPayment.connect(passenger).payUser(driver.address, PAYMENT_AMOUNT);
      await taxiPayment.connect(passenger).payUser(driver2.address, PAYMENT_AMOUNT); // 1st incentive here
      await taxiPayment.connect(passenger).payUser(driver3.address, PAYMENT_AMOUNT);

      const signers = await ethers.getSigners();
      // 4th unique driver should trigger 2nd incentive (1 new incentive)
      await expect(taxiPayment.connect(passenger).payUser(signers[5].address, PAYMENT_AMOUNT))
        .to.emit(taxiPayment, "IncentiveAwarded")
        .withArgs(passenger.address, INCENTIVE_AMOUNT); // Gets 1 new incentive (total 2, but only 1 new)
    });

    it("Should not award duplicate incentives for same driver", async function () {
      await mockToken.connect(passenger).approve(await taxiPayment.getAddress(), PAYMENT_AMOUNT * 3n);

      // Pay same driver 3 times
      await taxiPayment.connect(passenger).payUser(driver.address, PAYMENT_AMOUNT);
      await taxiPayment.connect(passenger).payUser(driver.address, PAYMENT_AMOUNT);
      await taxiPayment.connect(passenger).payUser(driver.address, PAYMENT_AMOUNT);

      // Check incentives awarded
      const userInfo = await taxiPayment.users(passenger.address);
      expect(userInfo.incentivesAwarded).to.equal(0); // No incentives for only 1 unique driver
    });

    it("Should track incentives awarded correctly", async function () {
      await mockToken.connect(passenger).approve(await taxiPayment.getAddress(), PAYMENT_AMOUNT * 3n);

      // Pay 2 different drivers
      await taxiPayment.connect(passenger).payUser(driver.address, PAYMENT_AMOUNT);
      await taxiPayment.connect(passenger).payUser(driver2.address, PAYMENT_AMOUNT);

      let userInfo = await taxiPayment.users(passenger.address);
      expect(userInfo.incentivesAwarded).to.equal(1); // 2 unique interactions / 2 = 1 incentive

      // Pay third driver
      await taxiPayment.connect(passenger).payUser(driver3.address, PAYMENT_AMOUNT);

      userInfo = await taxiPayment.users(passenger.address);
      expect(userInfo.incentivesAwarded).to.equal(1); // Still 1 (3/2 = 1)
    });
  });

  describe("Owner Functions", function () {
    it("Should allow owner to deposit incentive pool", async function () {
      const depositAmount = ethers.parseEther("50");
      const contractBalanceBefore = await mockToken.balanceOf(await taxiPayment.getAddress());

      await mockToken.approve(await taxiPayment.getAddress(), depositAmount);
      await taxiPayment.depositIncentivePool(depositAmount);

      const contractBalanceAfter = await mockToken.balanceOf(await taxiPayment.getAddress());
      expect(contractBalanceAfter - contractBalanceBefore).to.equal(depositAmount);
    });

    it("Should allow owner to withdraw funds", async function () {
      const withdrawAmount = ethers.parseEther("10");
      const ownerBalanceBefore = await mockToken.balanceOf(owner.address);

      await taxiPayment.withdrawFunds(withdrawAmount);

      const ownerBalanceAfter = await mockToken.balanceOf(owner.address);
      expect(ownerBalanceAfter - ownerBalanceBefore).to.equal(withdrawAmount);
    });

    it("Should fail if non-owner tries to deposit incentive pool", async function () {
      const depositAmount = ethers.parseEther("50");
      await mockToken.connect(passenger).approve(await taxiPayment.getAddress(), depositAmount);

      await expect(taxiPayment.connect(passenger).depositIncentivePool(depositAmount))
        .to.be.revertedWith("Only owner can call this");
    });

    it("Should fail if non-owner tries to withdraw funds", async function () {
      await expect(taxiPayment.connect(passenger).withdrawFunds(ethers.parseEther("10")))
        .to.be.revertedWith("Only owner can call this");
    });

    it("Should fail if withdrawing more than contract balance", async function () {
      const contractBalance = await mockToken.balanceOf(await taxiPayment.getAddress());
      const excessiveAmount = contractBalance + ethers.parseEther("1");

      await expect(taxiPayment.withdrawFunds(excessiveAmount))
        .to.be.revertedWith("Insufficient balance");
    });
  });

  describe("User Balance Tracking", function () {
    it("Should correctly track user spent balance", async function () {
      await mockToken.connect(passenger).approve(await taxiPayment.getAddress(), PAYMENT_AMOUNT * 3n);

      await taxiPayment.connect(passenger).payUser(driver.address, PAYMENT_AMOUNT);
      await taxiPayment.connect(passenger).payUser(driver2.address, PAYMENT_AMOUNT);
      await taxiPayment.connect(passenger).payUser(driver3.address, PAYMENT_AMOUNT);

      const [spent] = await taxiPayment.getUserBalances(passenger.address);
      expect(spent).to.equal(PAYMENT_AMOUNT * 3n);
    });

    it("Should correctly track user received balance", async function () {
      await mockToken.connect(passenger).approve(await taxiPayment.getAddress(), PAYMENT_AMOUNT * 2n);

      await taxiPayment.connect(passenger).payUser(driver.address, PAYMENT_AMOUNT);
      await taxiPayment.connect(passenger).payUser(driver.address, PAYMENT_AMOUNT);

      const [, received] = await taxiPayment.getUserBalances(driver.address);
      const expectedReceived = (PAYMENT_AMOUNT * 99n / 100n) * 2n; // 99% of each payment
      expect(received).to.equal(expectedReceived);
    });

    it("Should return zero for users with no transactions", async function () {
      const [spent, received] = await taxiPayment.getUserBalances(driver3.address);
      expect(spent).to.equal(0);
      expect(received).to.equal(0);
    });
  });

  describe("Edge Cases and Integration", function () {
    it("Should handle multiple passengers paying same driver", async function () {
      const passenger2 = driver3; // Reuse for simplicity
      await mockToken.transfer(passenger2.address, ethers.parseEther("500"));

      await mockToken.connect(passenger).approve(await taxiPayment.getAddress(), PAYMENT_AMOUNT);
      await mockToken.connect(passenger2).approve(await taxiPayment.getAddress(), PAYMENT_AMOUNT);

      await taxiPayment.connect(passenger).payUser(driver.address, PAYMENT_AMOUNT);
      await taxiPayment.connect(passenger2).payUser(driver.address, PAYMENT_AMOUNT);

      const [, driverReceived] = await taxiPayment.getUserBalances(driver.address);
      const expectedTotal = (PAYMENT_AMOUNT * 99n / 100n) * 2n;
      expect(driverReceived).to.equal(expectedTotal);
    });

    it("Should handle small payment amounts correctly", async function () {
      const smallAmount = ethers.parseEther("1"); // 1 cUSD
      await mockToken.connect(passenger).approve(await taxiPayment.getAddress(), smallAmount);

      await taxiPayment.connect(passenger).payUser(driver.address, smallAmount);

      const [, driverReceived] = await taxiPayment.getUserBalances(driver.address);
      const expectedAmount = smallAmount * 99n / 100n; // 0.99 cUSD
      expect(driverReceived).to.equal(expectedAmount);
    });

    it("Should handle large payment amounts correctly", async function () {
      const largeAmount = ethers.parseEther("999"); // 999 cUSD
      await mockToken.connect(passenger).approve(await taxiPayment.getAddress(), largeAmount);

      await taxiPayment.connect(passenger).payUser(driver.address, largeAmount);

      const [, driverReceived] = await taxiPayment.getUserBalances(driver.address);
      const expectedAmount = largeAmount * 99n / 100n; // 989.01 cUSD
      expect(driverReceived).to.equal(expectedAmount);
    });

    it("Should handle consecutive payments with incentives", async function () {
      const initialBalance = await mockToken.balanceOf(passenger.address);

      await mockToken.connect(passenger).approve(await taxiPayment.getAddress(), PAYMENT_AMOUNT * 5n);

      // Make 5 payments to 5 different drivers (should get 2 incentives)
      // Use driver, driver2, driver3 and get more signers (skip owner and passenger)
      await taxiPayment.connect(passenger).payUser(driver.address, PAYMENT_AMOUNT);
      await taxiPayment.connect(passenger).payUser(driver2.address, PAYMENT_AMOUNT);
      await taxiPayment.connect(passenger).payUser(driver3.address, PAYMENT_AMOUNT);

      const signers = await ethers.getSigners();
      await taxiPayment.connect(passenger).payUser(signers[5].address, PAYMENT_AMOUNT);
      await taxiPayment.connect(passenger).payUser(signers[6].address, PAYMENT_AMOUNT);

      const finalBalance = await mockToken.balanceOf(passenger.address);
      const totalSpent = PAYMENT_AMOUNT * 5n;
      const totalIncentives = INCENTIVE_AMOUNT * 2n; // 5 unique drivers / 2 = 2 incentives

      expect(finalBalance).to.equal(initialBalance - totalSpent + totalIncentives);
    });
  });
});
