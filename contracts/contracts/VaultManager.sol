// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./interfaces/IVault.sol";

contract VaultManager {
    address public owner;
    IVault public stableVault;
    mapping(address => bool) public vaults;
    address[] public vaultList;
    mapping(address => uint256) public userBalances;

    event Deposit(address indexed user, uint256 amount, uint256 timestamp);
    event Withdraw(address indexed user, uint256 amount, uint256 timestamp);

    constructor(address _stableVaultAddress) {
        owner = msg.sender;
        stableVault = IVault(_stableVaultAddress);
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Not the owner");
        _;
    }

    function addVault(address _vaultAddress) external onlyOwner {
        require(_vaultAddress != address(0), "Invalid vault address");
        require(!vaults[_vaultAddress], "Vault already added");
        vaults[_vaultAddress] = true;
        vaultList.push(_vaultAddress);
    }

    function removeVault(address _vaultAddress) external onlyOwner {
        require(vaults[_vaultAddress], "Vault not found");
        vaults[_vaultAddress] = false;
        for (uint256 i = 0; i < vaultList.length; i++) {
            if (vaultList[i] == _vaultAddress) {
                vaultList[i] = vaultList[vaultList.length - 1];
                vaultList.pop();
                break;
            }
        }
    }

    function getVaults() external view returns (address[] memory) {
        return vaultList;
    }

    function deposit(uint256 amount) external payable {
        require(msg.value == amount, "Sent ETH must equal amount");
        stableVault.deposit{value: amount}(amount);
        userBalances[msg.sender] += amount;
        emit Deposit(msg.sender, amount, block.timestamp);
    }

    function withdraw(uint256 amount) external {
        require(userBalances[msg.sender] >= amount, "Insufficient balance");
        stableVault.withdraw(amount);
        userBalances[msg.sender] -= amount;
        payable(msg.sender).transfer(amount);
        emit Withdraw(msg.sender, amount, block.timestamp);
    }

    function getTotalBalance() external view returns (uint256) {
        return stableVault.getTotalBalance();
    }

    function getUserBalance() external view returns (uint256) {
        return userBalances[msg.sender];
    }

    function getUserBalance(address user) external view returns (uint256) {
        return userBalances[user];
    }
}