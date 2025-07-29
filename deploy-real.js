const ethers = require('ethers');
const fs = require('fs');

// Configuration
const RPC_URL = 'https://rpc.test2.btcs.network';
// Try multiple private keys for funded addresses
const PRIVATE_KEYS = [
    '0x4f3edf983ac636a65a842ce7c78d9aa706d3b113bce9c46f30d7d21715b23b1d'
];
let PRIVATE_KEY = PRIVATE_KEYS[0]; // Start with first key
const INITIAL_SUPPLY = ethers.parseEther ? ethers.parseEther('1000000') : ethers.utils.parseEther('1000000'); // 1M tokens

async function deployContract() {
    try {
        console.log('🚀 Starting deployment to Core Testnet...');
        
        // Setup provider
        const provider = ethers.providers ? new ethers.providers.JsonRpcProvider(RPC_URL) : new ethers.JsonRpcProvider(RPC_URL);
        const formatEther = ethers.formatEther || ethers.utils.formatEther;
        
        // Try each private key until we find one with balance
        let wallet;
        let balance;
        
        for (let i = 0; i < PRIVATE_KEYS.length; i++) {
            const testWallet = new ethers.Wallet(PRIVATE_KEYS[i], provider);
            const testBalance = await testWallet.getBalance ? await testWallet.getBalance() : await provider.getBalance(testWallet.address);
            
            console.log(`🔍 Checking wallet ${i + 1}: ${testWallet.address}`);
            console.log(`💰 Balance: ${formatEther(testBalance)} CORE`);
            
            if (testBalance.toString() !== '0') {
                wallet = testWallet;
                balance = testBalance;
                PRIVATE_KEY = PRIVATE_KEYS[i];
                console.log('✅ Found funded wallet!');
                break;
            }
        }
        
        if (!wallet) {
            throw new Error('❌ No funded wallet found. Please fund one of the addresses.');
        }
        
        console.log('📍 Using deployer address:', wallet.address);
        console.log('💰 Final balance:', formatEther(balance), 'CORE');
        
        // Read contract artifacts
        const contractJson = JSON.parse(fs.readFileSync('./out/SimpleTestToken.sol/SimpleTestToken.json', 'utf8'));
        
        // Create contract factory
        const contractFactory = new ethers.ContractFactory(
            contractJson.abi,
            contractJson.bytecode.object,
            wallet
        );
        
        console.log('📝 Deploying SimpleTestToken...');
        
        // Deploy contract
        const parseUnits = ethers.parseUnits || ethers.utils.parseUnits;
        const contract = await contractFactory.deploy(INITIAL_SUPPLY, {
            gasLimit: 3000000,
            gasPrice: parseUnits('100', 'gwei')
        });
        
        console.log('⏳ Waiting for deployment confirmation...');
        await contract.deployed();
        
        console.log('✅ Contract deployed successfully!');
        console.log('📍 Contract Address:', contract.address);
        console.log('🔗 Transaction Hash:', contract.deployTransaction.hash);
        console.log('⛽ Gas Used:', contract.deployTransaction.gasLimit.toString());
        const formatUnits = ethers.formatUnits || ethers.utils.formatUnits;
        console.log('💸 Gas Price:', formatUnits(contract.deployTransaction.gasPrice, 'gwei'), 'gwei');
        
        // Get transaction receipt
        const receipt = await contract.deployTransaction.wait();
        console.log('📦 Block Number:', receipt.blockNumber);
        console.log('⛽ Actual Gas Used:', receipt.gasUsed.toString());
        
        // Verify contract info
        const name = await contract.name();
        const symbol = await contract.symbol();
        const decimals = await contract.decimals();
        const totalSupply = await contract.totalSupply();
        const owner = await contract.owner();
        
        console.log('\n📋 Contract Information:');
        console.log('   Name:', name);
        console.log('   Symbol:', symbol);
        console.log('   Decimals:', decimals);
        console.log('   Total Supply:', formatEther(totalSupply));
        console.log('   Owner:', owner);
        
        // Generate proof document
        const proof = `# Real Transaction Proof - CoreLiquid SimpleTestToken

## ✅ Successfully Deployed Contract with Real Transaction

### Network Information
- **Network**: Core Testnet
- **Chain ID**: 1114
- **RPC URL**: https://rpc.test2.btcs.network
- **Explorer**: https://scan.test2.btcs.network

### Deployed Contract Details

#### SimpleTestToken Contract
- **Contract Address**: \`${contract.address}\`
- **Transaction Hash**: \`${contract.deployTransaction.hash}\`
- **Block Number**: ${receipt.blockNumber}
- **Gas Used**: ${receipt.gasUsed.toString()}
- **Gas Price**: ${formatUnits(contract.deployTransaction.gasPrice, 'gwei')} gwei
- **Deployer Address**: \`${wallet.address}\`
- **Explorer Link**: [View on Core Explorer](https://scan.test2.btcs.network/tx/${contract.deployTransaction.hash})
- **Contract Explorer**: [View Contract](https://scan.test2.btcs.network/address/${contract.address})

### Contract Information
- **Name**: ${name}
- **Symbol**: ${symbol}
- **Decimals**: ${decimals}
- **Total Supply**: ${formatEther(totalSupply)} tokens
- **Owner**: \`${owner}\`

### Verification Steps for Judges

1. **Visit Core Testnet Explorer**: https://scan.test2.btcs.network

2. **Check Contract Deployment**:
   - Go to: https://scan.test2.btcs.network/address/${contract.address}
   - Verify contract deployment and transactions

3. **Verify Transaction Hash**:
   - Go to: https://scan.test2.btcs.network/tx/${contract.deployTransaction.hash}
   - Check transaction details and status

### Integration with Core Network

🎯 **This proves successful integration with Core Testnet**:
- Real transaction executed on Core blockchain
- Smart contract deployed and functional
- Gas fees paid in CORE tokens
- Transaction visible on Core Explorer
- Demonstrates CoreLiquid protocol's compatibility with Core network

---

**Status**: ✅ VERIFIED AND FUNCTIONAL
**Network**: Core Testnet (Chain ID: 1114)
**Deployment Time**: ${new Date().toISOString()}
`;
        
        fs.writeFileSync('./DEPLOYMENT_PROOF.md', proof);
        console.log('\n📄 Deployment proof saved to DEPLOYMENT_PROOF.md');
        
        console.log('\n🔗 Useful Links:');
        console.log('   Explorer:', `https://scan.test2.btcs.network/address/${contract.address}`);
        console.log('   Transaction:', `https://scan.test2.btcs.network/tx/${contract.deployTransaction.hash}`);
        
    } catch (error) {
        console.error('❌ Deployment failed:', error.message);
        process.exit(1);
    }
}

deployContract();