// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract RewardNFT is ERC721, Ownable {
    uint256 private _tokenIdCounter;
    mapping(uint256 => uint256) public nftBoosts; // tokenId => boost percentage (e.g., 250 = 2.5%)
    
    // NFT types and their boosts
    enum NFTType { Genesis, Multiplier, Access }
    mapping(uint256 => NFTType) public nftTypes;
    
    constructor() ERC721("RewardNFT", "RWNFT") Ownable(msg.sender) {
        _tokenIdCounter = 1; // Start from token ID 1
    }

    function mint(address to, NFTType nftType) public returns (uint256) {
        uint256 tokenId = _tokenIdCounter;
        _tokenIdCounter++;
        
        _safeMint(to, tokenId);
        
        nftTypes[tokenId] = nftType;
        
        // Set boost based on NFT type
        if (nftType == NFTType.Genesis) {
            nftBoosts[tokenId] = 250; // 2.5% boost
        } else if (nftType == NFTType.Multiplier) {
            nftBoosts[tokenId] = 120; // 1.2% boost
        } else if (nftType == NFTType.Access) {
            nftBoosts[tokenId] = 0; // No boost, just access
        }
        
        return tokenId;
    }
    
    function mintGenesis(address to) external returns (uint256) {
        return mint(to, NFTType.Genesis);
    }
    
    function mintMultiplier(address to) external returns (uint256) {
        return mint(to, NFTType.Multiplier);
    }
    
    function mintAccess(address to) external returns (uint256) {
        return mint(to, NFTType.Access);
    }
    
    function totalSupply() external view returns (uint256) {
        return _tokenIdCounter - 1;
    }
    
    function getUserBoost(address user) external view returns (uint256) {
        uint256 totalBoost = 0;
        uint256 balance = balanceOf(user);
        
        for (uint256 i = 0; i < balance; i++) {
            uint256 tokenId = tokenOfOwnerByIndex(user, i);
            totalBoost += nftBoosts[tokenId];
        }
        
        return totalBoost;
    }
    
    function tokenOfOwnerByIndex(address owner, uint256 index) public view returns (uint256) {
        require(index < balanceOf(owner), "Index out of bounds");
        
        uint256 tokenCount = 0;
        for (uint256 tokenId = 1; tokenId < _tokenIdCounter; tokenId++) {
            if (_ownerOf(tokenId) == owner) {
                if (tokenCount == index) {
                    return tokenId;
                }
                tokenCount++;
            }
        }
        
        revert("Token not found");
    }
}