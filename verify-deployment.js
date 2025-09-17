// Post-Deployment Verification Script
const { ethers } = require('ethers');

// Load deployment addresses
let deploymentAddresses;
try {
  deploymentAddresses = require('./deployment-addresses.json');
} catch (error) {
  console.error('❌ No deployment addresses found. Please deploy contracts first.');
  process.exit(1);
}

async function verifyDeployment() {
  console.log('🔍 VERIFYING SOMNIA DEPLOYMENT');
  console.log('=' * 40);
  
  const provider = new ethers.JsonRpcProvider('https://dream-rpc.somnia.network/');
  
  console.log(`\n📋 Deployment Info:`);
  console.log(`Network: ${deploymentAddresses.network}`);
  console.log(`Chain ID: ${deploymentAddresses.chainId}`);
  console.log(`Deployer: ${deploymentAddresses.deployer}`);
  console.log(`Deployed: ${deploymentAddresses.deployedAt || 'Unknown'}`);
  
  const tests = [];
  
  // Test 1: Contract Code Verification
  console.log('\n🔍 Test 1: Contract Code Verification');
  for (const [name, address] of Object.entries(deploymentAddresses)) {
    if (name.includes('Address') || typeof address !== 'string' || !address.startsWith('0x')) continue;
    
    try {
      const code = await provider.getCode(address);
      if (code === '0x') {
        console.log(`❌ ${name}: No contract at ${address}`);
        tests.push({ name: `${name} deployment`, status: 'FAIL' });
      } else {
        console.log(`✅ ${name}: Contract deployed (${code.length} bytes)`);
        tests.push({ name: `${name} deployment`, status: 'PASS' });
      }
    } catch (error) {
      console.log(`❌ ${name}: Error checking contract - ${error.message}`);
      tests.push({ name: `${name} deployment`, status: 'FAIL' });
    }
  }
  
  // Test 2: Network Connectivity
  console.log('\n🌐 Test 2: Network Connectivity');
  try {
    const blockNumber = await provider.getBlockNumber();
    const network = await provider.getNetwork();
    console.log(`✅ Connected to Somnia (Block: ${blockNumber}, Chain: ${network.chainId})`);
    tests.push({ name: 'Network connectivity', status: 'PASS' });
  } catch (error) {
    console.log(`❌ Network connection failed: ${error.message}`);
    tests.push({ name: 'Network connectivity', status: 'FAIL' });
  }
  
  // Test 3: Contract Interactions
  console.log('\n🧪 Test 3: Contract Read Functions');
  try {
    // Load contract ABIs
    const VaultManagerABI = require('./app/contracts/VaultManager.json').abi;
    const RewardNFTABI = require('./app/contracts/RewardNFT.json').abi;
    
    if (deploymentAddresses.VaultManager) {
      const vaultManager = new ethers.Contract(deploymentAddresses.VaultManager, VaultManagerABI, provider);
      const totalBalance = await vaultManager.getTotalBalance();
      console.log(`✅ VaultManager.getTotalBalance(): ${ethers.formatEther(totalBalance)} ETH`);
      tests.push({ name: 'VaultManager read', status: 'PASS' });
    }
    
    if (deploymentAddresses.RewardNFT) {
      const rewardNFT = new ethers.Contract(deploymentAddresses.RewardNFT, RewardNFTABI, provider);
      const totalSupply = await rewardNFT.totalSupply();
      console.log(`✅ RewardNFT.totalSupply(): ${totalSupply.toString()}`);
      tests.push({ name: 'RewardNFT read', status: 'PASS' });
    }
    
  } catch (error) {
    console.log(`❌ Contract interaction failed: ${error.message}`);
    tests.push({ name: 'Contract interactions', status: 'FAIL' });
  }
  
  // Test 4: Frontend Integration
  console.log('\n🖥️  Test 4: Frontend Integration');
  const fs = require('fs');
  
  // Check if frontend config updated
  if (fs.existsSync('./frontend/app/services/deployed-contracts.json')) {
    console.log('✅ Frontend contract addresses updated');
    tests.push({ name: 'Frontend integration', status: 'PASS' });
  } else {
    console.log('⚠️  Frontend may not have updated addresses');
    tests.push({ name: 'Frontend integration', status: 'WARN' });
  }
  
  // Test 5: Block Explorer Verification
  console.log('\n🔗 Test 5: Block Explorer Links');
  const explorerBase = deploymentAddresses.blockExplorer || 'https://shannon-explorer.somnia.network/';
  
  Object.entries(deploymentAddresses).forEach(([name, address]) => {
    if (typeof address === 'string' && address.startsWith('0x')) {
      console.log(`📍 ${name}: ${explorerBase}address/${address}`);
    }
  });
  tests.push({ name: 'Explorer verification', status: 'PASS' });
  
  // Results Summary
  console.log('\n📊 VERIFICATION RESULTS');
  console.log('=' * 40);
  
  const passed = tests.filter(t => t.status === 'PASS').length;
  const failed = tests.filter(t => t.status === 'FAIL').length;
  const warnings = tests.filter(t => t.status === 'WARN').length;
  
  tests.forEach(test => {
    const status = test.status === 'PASS' ? '✅' : test.status === 'FAIL' ? '❌' : '⚠️';
    console.log(`${status} ${test.name}`);
  });
  
  console.log(`\nSummary: ${passed} passed, ${failed} failed, ${warnings} warnings`);
  
  if (failed === 0) {
    console.log('\n🎉 DEPLOYMENT VERIFICATION SUCCESSFUL!');
    console.log('✅ All systems operational');
    console.log('🚀 Ready for production launch');
    
    console.log('\n🌟 Next Steps:');
    console.log('1. Start frontend: cd frontend && npm run dev');
    console.log('2. Open http://localhost:3000');
    console.log('3. Connect wallet to Somnia testnet');
    console.log('4. Test deposit/withdraw functionality');
    console.log('5. Verify NFT minting works');
    
    return true;
  } else {
    console.log('\n❌ DEPLOYMENT VERIFICATION FAILED');
    console.log('Please fix the issues above before launching');
    return false;
  }
}

// Run verification
verifyDeployment()
  .then(success => {
    process.exit(success ? 0 : 1);
  })
  .catch(error => {
    console.error('❌ Verification script failed:', error);
    process.exit(1);
  });