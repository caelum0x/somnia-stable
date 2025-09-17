const { ethers } = require('ethers');

const privateKey = process.env.PRIVATE_KEY || '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80';
const wallet = new ethers.Wallet(privateKey);

console.log('Test Deployer Address:', wallet.address);
console.log('Get test tokens at: https://testnet.somnia.network/');
console.log('Address to send tokens to:', wallet.address);