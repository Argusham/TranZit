// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IERC20 {
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
    function transfer(address recipient, uint256 amount) external returns (bool);
    function approve(address spender, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
}

contract TaxiPaymentcUSD {
    address public owner;
    IERC20 public cUSDToken; // Reference to the cUSD token
    uint public constant TAX_PERCENT = 1; // 1% tax
    uint public constant INCENTIVE_TRIGGER = 2; // Incentive after 2 unique interactions
    uint public constant INCENTIVE_AMOUNT = 0.2 ether; // Incentive in cUSD, e.g., 0.2 cUSD

    struct User {
        uint balanceSpent;
        uint balanceReceived;
        mapping(address => bool) uniqueInteractedUsers; // Tracks unique users interacted with for O(1) lookup
        uint uniqueUserCount; // Number of unique users interacted with
    }

    mapping(address => User) public users;

    event PaymentMade(address indexed payer, address indexed payee, uint amount);
    event IncentiveAwarded(address indexed user, uint amount);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this");
        _;
    }

    constructor(address _cUSDTokenAddress) {
        owner = msg.sender;
        cUSDToken = IERC20(_cUSDTokenAddress); // Initialize the cUSD token address
    }

    function payUser(address recipient, uint amount) public {
        require(amount > 0, "Payment must be greater than 0");
        require(cUSDToken.balanceOf(msg.sender) >= amount, "Insufficient cUSD balance");
        
        // Calculate tax and recipient amount
        uint tax = (amount * TAX_PERCENT) / 100;
        uint recipientAmount = amount - tax;

        // Transfer cUSD from sender to contract for tax and to the recipient for payment
        require(cUSDToken.transferFrom(msg.sender, address(this), tax), "Tax transfer failed");
        require(cUSDToken.transferFrom(msg.sender, recipient, recipientAmount), "Payment transfer failed");

        // Update the sender and recipient balances
        users[recipient].balanceReceived += recipientAmount;
        users[msg.sender].balanceSpent += amount;

        // Track unique users interacted with
        _trackUniqueInteraction(msg.sender, recipient);

        emit PaymentMade(msg.sender, recipient, amount);

        // Check for incentive eligibility for both users
        _checkAndAwardIncentive(msg.sender);
        _checkAndAwardIncentive(recipient);
    }

    function _trackUniqueInteraction(address payer, address payee) internal {
        // Track unique interaction for the payer
        if (!users[payer].uniqueInteractedUsers[payee]) {
            users[payer].uniqueInteractedUsers[payee] = true;
            users[payer].uniqueUserCount++;
        }

        // Track unique interaction for the payee
        if (!users[payee].uniqueInteractedUsers[payer]) {
            users[payee].uniqueInteractedUsers[payer] = true;
            users[payee].uniqueUserCount++;
        }
    }

    function _checkAndAwardIncentive(address user) internal {
        if (users[user].uniqueUserCount >= INCENTIVE_TRIGGER) {
            require(cUSDToken.transfer(user, INCENTIVE_AMOUNT), "Incentive transfer failed");
            emit IncentiveAwarded(user, INCENTIVE_AMOUNT);
        }
    }

    // Contract can receive funds (for incentive pool)
    function depositIncentivePool(uint amount) external onlyOwner {
        require(cUSDToken.transferFrom(msg.sender, address(this), amount), "Incentive pool deposit failed");
    }

    // Owner can withdraw funds from the contract
    function withdrawFunds(uint amount) external onlyOwner {
        require(cUSDToken.balanceOf(address(this)) >= amount, "Insufficient balance");
        require(cUSDToken.transfer(owner, amount), "Withdraw failed");
    }

    // Get user balances
    function getUserBalances(address user) external view returns (uint balanceSpent, uint balanceReceived) {
        balanceSpent = users[user].balanceSpent;
        balanceReceived = users[user].balanceReceived;
    }
}
