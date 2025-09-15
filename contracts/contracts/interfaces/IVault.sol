// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IVault {
    function deposit(uint256 amount) external payable;
    function withdraw(uint256 amount) external;
    function getTotalBalance() external view returns (uint256);
}