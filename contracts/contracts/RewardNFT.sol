// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract RewardNFT is ERC721, Ownable {
    constructor() ERC721("RewardNFT", "RWNFT") Ownable(msg.sender) {}

    // Other functions and logic
}