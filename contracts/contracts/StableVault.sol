// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./interfaces/IVault.sol";

contract StableVault is IVault {
    address public owner;
    uint256 private totalBalance;

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Not the owner");
        _;
    }

    function deposit(uint256 amount) external payable override {
        require(msg.value == amount, "Incorrect amount sent");
        totalBalance += amount;
    }

    function withdraw(uint256 amount) external override {
        require(totalBalance >= amount, "Insufficient balance");
        totalBalance -= amount;
        payable(msg.sender).transfer(amount);
    }

    function getTotalBalance() external view override returns (uint256) {
        return totalBalance;
    }
}