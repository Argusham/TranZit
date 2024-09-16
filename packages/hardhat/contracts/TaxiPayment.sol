// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract TaxiPayment {
    address public owner;
    uint public constant TAX_PERCENT = 1; // 1% tax
    uint public constant INCENTIVE_TRIGGER = 2; // Incentive after 2 unique interactions
    uint public constant INCENTIVE_AMOUNT = 0.5 ether; // Incentive in cUSD increased to 0.5

    struct User {
        uint balanceSpent;
        uint balanceReceived;
        address[] uniqueInteractedUsers; // Tracks unique users interacted with
    }
    
    mapping(address => User) public users;
    
    event PaymentMade(address indexed payer, address indexed payee, uint amount);
    event IncentiveAwarded(address indexed user, uint amount);
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this");
        _;
    }
    
    constructor() {
        owner = msg.sender;
    }
    
    function payUser(address recipient) public payable {
        require(msg.value > 0, "Payment must be greater than 0");

        uint tax = (msg.value * TAX_PERCENT) / 100;
        uint recipientAmount = msg.value - tax;

        // Update the sender and recipient balances
        users[recipient].balanceReceived += recipientAmount;
        users[msg.sender].balanceSpent += msg.value;

        // Track unique users interacted with
        _trackUniqueInteraction(msg.sender, recipient);

        // Transfer the payment to the recipient
        payable(recipient).transfer(recipientAmount);

        emit PaymentMade(msg.sender, recipient, msg.value);

        // Check for incentive eligibility for both users
        _checkAndAwardIncentive(msg.sender);
        _checkAndAwardIncentive(recipient);
    }

    function _trackUniqueInteraction(address payer, address payee) internal {
        if (!_isUserUnique(payer, payee)) {
            users[payer].uniqueInteractedUsers.push(payee);
        }
        if (!_isUserUnique(payee, payer)) {
            users[payee].uniqueInteractedUsers.push(payer);
        }
    }

    function _isUserUnique(address user, address interactedUser) internal view returns (bool) {
        address[] memory uniqueUsers = users[user].uniqueInteractedUsers;
        for (uint i = 0; i < uniqueUsers.length; i++) {
            if (uniqueUsers[i] == interactedUser) {
                return true;
            }
        }
        return false;
    }

    function _checkAndAwardIncentive(address user) internal {
        if (users[user].uniqueInteractedUsers.length >= INCENTIVE_TRIGGER) {
            payable(user).transfer(INCENTIVE_AMOUNT);
            emit IncentiveAwarded(user, INCENTIVE_AMOUNT);
        }
    }

    // Contract can receive funds (for incentive pool)
    receive() external payable {}

    // Owner can withdraw funds from the contract
    function withdrawFunds(uint amount) external onlyOwner {
        require(address(this).balance >= amount, "Insufficient balance");
        payable(owner).transfer(amount);
    }

    // Get user balances
    function getUserBalances(address user) external view returns (uint balanceSpent, uint balanceReceived) {
        balanceSpent = users[user].balanceSpent;
        balanceReceived = users[user].balanceReceived;
    }
}
