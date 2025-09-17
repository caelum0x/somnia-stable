#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 SOMNIA TESTNET DEPLOYMENT AUTOMATION');
console.log('=' * 50);

// Check if we're in the right directory
if (!fs.existsSync('hardhat.config.ts')) {
  console.error('❌ Please run this script from the project root directory');
  process.exit(1);
}

// Check if private key is set
if (!process.env.PRIVATE_KEY) {
  console.log('\n📝 SETUP REQUIRED:');
  console.log('1. Create a .env file with your PRIVATE_KEY');
  console.log('2. Get STT tokens from: https://testnet.somnia.network/');
  console.log('3. Add Somnia testnet to MetaMask:');
  console.log('   - RPC: https://dream-rpc.somnia.network/');
  console.log('   - Chain ID: 50312');
  console.log('   - Symbol: STT');
  console.log('\nExample .env file:');
  console.log('PRIVATE_KEY=your_wallet_private_key_here');
  console.log('\n⚠️  Never commit your private key to git!');
  process.exit(1);
}

async function deploy() {
  try {
    console.log('\n1️⃣ Installing dependencies...');
    execSync('npm install', { stdio: 'inherit', cwd: '.' });
    
    console.log('\n2️⃣ Compiling contracts...');
    execSync('npx hardhat compile', { stdio: 'inherit', cwd: '.' });
    
    console.log('\n3️⃣ Deploying to Somnia testnet...');
    execSync('npx hardhat run contracts/scripts/deploy-somnia.ts --network somnia', { 
      stdio: 'inherit', 
      cwd: '.',
      env: { ...process.env, NODE_ENV: 'production' }
    });
    
    console.log('\n4️⃣ Updating frontend configuration...');
    
    // Check if deployment was successful
    if (fs.existsSync('deployment-addresses.json')) {
      const deployment = JSON.parse(fs.readFileSync('deployment-addresses.json', 'utf8'));
      
      if (deployment.network === 'somniaTestnet') {
        console.log('✅ Frontend will automatically use deployed contract addresses');
        
        console.log('\n5️⃣ Starting development server...');
        console.log('Visit http://localhost:3000 to test the application');
        
        // Start the frontend
        execSync('npm run dev', { 
          stdio: 'inherit', 
          cwd: './frontend'
        });
      }
    }
    
  } catch (error) {
    console.error('\n❌ Deployment failed:');
    console.error(error.message);
    
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Check your private key is correct');
    console.log('2. Ensure you have STT tokens: https://testnet.somnia.network/');
    console.log('3. Verify network connection');
    console.log('4. Check hardhat.config.ts configuration');
    
    process.exit(1);
  }
}

deploy();