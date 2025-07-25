# CoreLiquid Protocol Testing Guide

## Overview

This guide provides comprehensive instructions for running tests on the CoreLiquid Protocol. The testing infrastructure is built using **Foundry** (Forge) and follows best practices from Core DAO documentation and Hardhat tutorials.

## 🚀 Quick Start

### Prerequisites

1. **Install Foundry**:
   ```bash
   curl -L https://foundry.paradigm.xyz | bash
   foundryup
   ```

2. **Install Dependencies**:
   ```bash
   forge install
   ```

3. **Compile Contracts**:
   ```bash
   npm run compile
   # or
   forge build
   ```

## 🧪 Running Tests

### All Tests
```bash
npm run test
# or
forge test
```

### Unit Tests Only
```bash
npm run test:unit
# or
forge test --match-path "test/unit/**/*.sol"
```

### Integration Tests Only
```bash
npm run test:integration
# or
forge test --match-path "test/integration/**/*.sol"
```

### Specific Contract Tests
```bash
# Core Native Staking tests
npm run test:core-native

# stCORE Token tests
npm run test:stcore

# Revenue Model tests
npm run test:revenue

# Unified Liquidity Pool tests
npm run test:liquidity

# Full Integration tests
npm run test:integration-full
```

### Advanced Testing Options

#### Verbose Output
```bash
npm run test:verbose
# or
forge test -vvv
```

#### Gas Reports
```bash
npm run test:gas
# or
forge test --gas-report
```

#### Coverage Reports
```bash
npm run test:coverage
# or
forge coverage
```

#### Watch Mode (Auto-rerun on changes)
```bash
npm run test:watch
# or
forge test --watch
```

## 📁 Test Structure

```
test/
├── BaseTest.t.sol                     # Base test contract with common setup
├── unit/                               # Unit tests for individual contracts
│   ├── CoreNativeStaking.t.sol        # Core staking functionality tests
│   ├── StCOREToken.t.sol              # Liquid staking token tests
│   ├── RevenueModel.t.sol             # Revenue sharing tests
│   └── UnifiedLiquidityPool.t.sol     # Liquidity pool tests
└── integration/                        # Integration tests
    └── CoreLiquidIntegration.t.sol     # End-to-end workflow tests
```

## 🔧 Test Categories

### Unit Tests

#### 1. CoreNativeStaking.t.sol
- **BTC Staking**: Tests BTC staking with dual staking tiers
- **CORE Staking**: Tests native CORE staking and stCORE minting
- **Reward System**: Tests reward calculation and claiming
- **Access Control**: Tests admin functions and pause mechanisms
- **Edge Cases**: Tests minimum amounts, slippage protection

#### 2. StCOREToken.t.sol
- **Minting/Burning**: Tests liquid staking token lifecycle
- **Exchange Rate**: Tests rate calculations with rewards
- **Protocol Fees**: Tests fee collection and distribution
- **Reward Distribution**: Tests automated reward compounding
- **Pause Functionality**: Tests emergency pause mechanisms

#### 3. RevenueModel.t.sol
- **Revenue Collection**: Tests fee collection from various sources
- **Profit Sharing**: Tests revenue distribution according to model
- **Partner Management**: Tests partner fee sharing system
- **Reward Claiming**: Tests user reward claiming mechanism
- **Configuration**: Tests profit sharing parameter updates

#### 4. UnifiedLiquidityPool.t.sol
- **Liquidity Provision**: Tests adding/removing liquidity
- **LP Token Management**: Tests LP token minting/burning
- **Fee Collection**: Tests trading fee accumulation
- **Pool Rebalancing**: Tests automated pool management
- **Utilization Tracking**: Tests pool utilization metrics

### Integration Tests

#### CoreLiquidIntegration.t.sol
- **Complete Staking Workflow**: End-to-end staking and unstaking
- **Dual Staking Integration**: BTC + CORE staking workflows
- **Revenue Flow**: Complete revenue generation and distribution
- **Multi-User Scenarios**: Tests with multiple participants
- **Cross-Contract Interactions**: Tests contract integrations
- **Economic Scenarios**: Tests various market conditions

## 🎯 Test Coverage

The test suite covers:

- ✅ **Core Integration** (BTC staking, stCORE tokens, dual staking)
- ✅ **Revenue Model** (Profit sharing, fee distribution, partner system)
- ✅ **Liquidity Management** (Pool operations, LP tokens, rebalancing)
- ✅ **Access Control** (Admin functions, emergency mechanisms)
- ✅ **Edge Cases** (Minimum amounts, slippage, precision)
- ✅ **Multi-User Scenarios** (Competition, cross-validator staking)
- ✅ **Economic Models** (Reward distribution, exchange rates)

## 🔍 Test Patterns

### Common Test Structure
```solidity
function testFeatureName() public {
    // 1. Setup
    uint256 amount = 100e18;
    vm.prank(alice);
    token.approve(address(contract), amount);
    
    // 2. Execute
    vm.prank(alice);
    uint256 result = contract.performAction(amount);
    
    // 3. Assert
    assertEq(result, expectedValue);
    assertEq(token.balanceOf(alice), expectedBalance);
}
```

### Event Testing
```solidity
expectEmitCheckAll();
emit EventName(expectedParam1, expectedParam2);

vm.prank(user);
contract.functionThatEmitsEvent();
```

### Time Manipulation
```solidity
// Skip time for testing time-dependent features
skipTime(30 days);

// Skip blocks for testing block-dependent features
skip(1000);
```

### Error Testing
```solidity
vm.expectRevert("Expected error message");
vm.prank(user);
contract.functionThatShouldRevert();
```

## 🚨 Common Issues & Solutions

### 1. "Contract not found" Error
```bash
# Make sure contracts are compiled
forge build
```

### 2. "Insufficient balance" in tests
```solidity
// Check BaseTest.t.sol for initial balance setup
// Default: 10,000 CORE per test user
```

### 3. Gas limit issues
```bash
# Increase gas limit in foundry.toml
gas_limit = 18446744073709551615
```

### 4. RPC connection issues
```bash
# Use local testing (default)
forge test

# Or specify RPC for fork testing
forge test --rpc-url https://rpc.coredao.org
```

## 📊 Performance Benchmarks

### Expected Test Execution Times
- **Unit Tests**: ~30-60 seconds
- **Integration Tests**: ~60-120 seconds
- **Full Test Suite**: ~2-3 minutes
- **Coverage Report**: ~3-5 minutes

### Gas Usage Benchmarks
- **CORE Staking**: ~150,000 gas
- **BTC Staking**: ~200,000 gas
- **Liquidity Addition**: ~120,000 gas
- **Revenue Distribution**: ~180,000 gas

## 🔧 Configuration

### Foundry Configuration (foundry.toml)
```toml
[profile.default]
src = "contracts"
test = "test"
out = "out"
libs = ["lib"]

# Test settings
verbosity = 2
gas_reports = ["*"]
gas_limit = 18446744073709551615

# Fuzz testing
[fuzz]
runs = 1000
max_test_rejects = 65536
```

### Environment Variables
```bash
# Optional: For deployment testing
export CORE_RPC_URL="https://rpc.coredao.org"
export PRIVATE_KEY="your_private_key"
export ETHERSCAN_API_KEY="your_api_key"
```

## 🎯 Best Practices

1. **Always run tests before deployment**
2. **Check coverage reports regularly**
3. **Test edge cases and error conditions**
4. **Use descriptive test names**
5. **Keep tests isolated and independent**
6. **Mock external dependencies when possible**
7. **Test with realistic data amounts**
8. **Verify event emissions**
9. **Test access control thoroughly**
10. **Include gas optimization tests**

## 🚀 Continuous Integration

For CI/CD pipelines, use:

```yaml
# GitHub Actions example
- name: Run Foundry Tests
  run: |
    forge test --gas-report
    forge coverage --report lcov
```

## 📚 Additional Resources

- [Core DAO Liquid Staking Documentation](https://docs.coredao.org/docs/category/liquid-staking)
- [Core DAO Hardhat Tutorial](https://github.com/coredao-org/hardhat-tutorial)
- [Foundry Documentation](https://book.getfoundry.sh/)
- [Forge Testing Guide](https://book.getfoundry.sh/forge/tests)

## 🆘 Support

If you encounter issues:

1. Check the [Common Issues](#-common-issues--solutions) section
2. Verify your Foundry installation: `forge --version`
3. Ensure all dependencies are installed: `forge install`
4. Check contract compilation: `forge build`
5. Run tests with verbose output: `forge test -vvv`

---

**Happy Testing! 🧪✨**

The comprehensive test suite ensures the CoreLiquid Protocol is robust, secure, and ready for production deployment on Core Chain.