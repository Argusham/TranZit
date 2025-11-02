// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IERC20 {
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
    function transfer(address recipient, uint256 amount) external returns (bool);
    function approve(address spender, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
}

contract ImporvedTaxiPaymentcUSD {
    address public owner;
    IERC20 public cUSDToken; // Reference to the cUSD token

    uint public constant TAX_PERCENT = 1; // 1% tax
    uint public constant INCENTIVE_TRIGGER = 2; // Every 2 unique interactions trigger an incentive
    uint public constant INCENTIVE_AMOUNT = 0.1 ether; // Incentive amount in cUSD (0.1 cUSD)

    struct User {
        uint balanceSpent;
        uint balanceReceived;
        mapping(address => bool) uniqueInteractedUsers; // O(1) lookup for uniqueness
        uint uniqueUserCount; // Number of unique drivers interacted with
        uint incentivesAwarded; // Number of incentive rewards already awarded (each represents 2 unique interactions)
    }

    mapping(address => User) public users;

    event PaymentMade(address indexed payer, address indexed driver, uint amount);
    event IncentiveAwarded(address indexed payer, uint amount);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this");
        _;
    }

    constructor(address _cUSDTokenAddress) {
        owner = msg.sender;
        cUSDToken = IERC20(_cUSDTokenAddress); // Initialize the cUSD token address
    }

    function payUser(address driver, uint amount) public {
        require(amount > 0, "Payment must be greater than 0");
        require(cUSDToken.balanceOf(msg.sender) >= amount, "Insufficient cUSD balance");
        require(driver != msg.sender, "Cannot pay yourself");

        // Calculate tax and net amount to send to the driver.
        uint tax = (amount * TAX_PERCENT) / 100;
        uint recipientAmount = amount - tax;

        // Transfer cUSD from sender: tax goes to the contract, net amount to the driver.
        require(cUSDToken.transferFrom(msg.sender, address(this), tax), "Tax transfer failed");
        require(cUSDToken.transferFrom(msg.sender, driver, recipientAmount), "Payment transfer failed");

        // Update balances.
        users[driver].balanceReceived += recipientAmount;
        users[msg.sender].balanceSpent += amount;

        // Track unique interactions for the payer.
        _trackUniqueInteraction(msg.sender, driver);

        emit PaymentMade(msg.sender, driver, amount);

        // Award incentive to the payer (if eligible).
        _checkAndAwardIncentive(msg.sender);
    }

    // Records a unique interaction between a payer and a driver.
    function _trackUniqueInteraction(address payer, address driver) internal {
        if (!users[payer].uniqueInteractedUsers[driver]) {
            users[payer].uniqueInteractedUsers[driver] = true;
            users[payer].uniqueUserCount++;
        }
        // Optionally, you could also track the reverse for the driver, 
        // but for incentive purposes we only reward the payer.
    }

    // Checks if the payer qualifies for new incentives.
    // For every two unique interactions that haven't been rewarded yet, the payer receives 0.1 cUSD.
    function _checkAndAwardIncentive(address payer) internal {
        uint eligibleIncentives = users[payer].uniqueUserCount / INCENTIVE_TRIGGER;
        if (eligibleIncentives > users[payer].incentivesAwarded) {
            uint newIncentives = eligibleIncentives - users[payer].incentivesAwarded;
            uint totalReward = newIncentives * INCENTIVE_AMOUNT;
            require(cUSDToken.transfer(payer, totalReward), "Incentive transfer failed");
            users[payer].incentivesAwarded = eligibleIncentives;
            emit IncentiveAwarded(payer, totalReward);
        }
    }

    // Owner deposits funds into the contract for the incentive pool.
    function depositIncentivePool(uint amount) external onlyOwner {
        require(cUSDToken.transferFrom(msg.sender, address(this), amount), "Incentive pool deposit failed");
    }

    // Owner can withdraw funds from the contract.
    function withdrawFunds(uint amount) external onlyOwner {
        require(cUSDToken.balanceOf(address(this)) >= amount, "Insufficient balance");
        require(cUSDToken.transfer(owner, amount), "Withdraw failed");
    }

    // View function to get a user's spent and received balances.
    function getUserBalances(address userAddr) external view returns (uint balanceSpent, uint balanceReceived) {
        balanceSpent = users[userAddr].balanceSpent;
        balanceReceived = users[userAddr].balanceReceived;
    }
}
