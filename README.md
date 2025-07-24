# CoreFluidX - Unified Liquidity Protocol

![CoreFluidX Banner](https://img.shields.io/badge/CoreFluidX-Unified%20Liquidity%20Protocol-orange?style=for-the-badge&logo=ethereum)

## 🚀 Overview

CoreFluidX is an advanced DeFi protocol built on Core Chain that provides unified liquidity management, automated yield optimization, and seamless cross-protocol integration. Our platform enables users to maximize their returns through intelligent liquidity strategies while maintaining security and transparency.

## ✨ Key Features

### 🏦 Unified Liquidity Pool
- **Multi-Asset Support**: Deposit CORE, ETH, WBTC, USDC, USDT, and DAI
- **Automated Rebalancing**: Smart algorithms optimize asset allocation
- **Cross-Protocol Integration**: Leverage multiple DeFi protocols simultaneously

### 📈 Yield Optimization
- **Intelligent Strategies**: AI-powered yield farming across 15+ protocols
- **Risk Management**: Advanced health factor monitoring and liquidation protection
- **Compound Returns**: Automatic reinvestment of earned yields

### 🔒 Security First
- **Multi-Signature Wallets**: Enhanced security for protocol funds
- **Audited Smart Contracts**: Thoroughly tested and verified code
- **Real-time Risk Assessment**: Continuous monitoring of portfolio health

### ⚡ Advanced Features
- **Flash Loans**: Instant liquidity for arbitrage opportunities
- **Governance Token**: CORE token holders participate in protocol decisions
- **Analytics Dashboard**: Comprehensive portfolio tracking and insights

## 🛠 Technology Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS with custom cyberpunk theme
- **UI Components**: Radix UI primitives
- **Smart Contracts**: Solidity ^0.8.19
- **Blockchain**: Core Chain
- **State Management**: React Context with useReducer

## 🏗 Architecture

### Smart Contracts
```
contracts/
├── common/
│   ├── RiskEngine.sol          # Risk assessment and health factor calculation
│   ├── OracleRouter.sol        # Price feed aggregation
│   ├── ProtocolRouter.sol      # Cross-protocol interaction
│   └── EligibilityTracker.sol  # User eligibility and rewards
├── deposit/
│   ├── TokenVault.sol          # Asset storage and management
│   └── ULPManager.sol          # Unified Liquidity Pool management
├── borrow/
│   ├── LendingMarket.sol       # Lending and borrowing logic
│   └── CollateralManager.sol   # Comprehensive collateral management (CollateralAdapter integrated)
└── dashboard/
    └── UserPositionRegistry.sol # User position tracking
```

### Frontend Components
```
components/
├── ui/                    # Base UI components (Radix UI)
├── tabs/                  # Feature-specific components
├── cyber-button.tsx       # Custom styled buttons
├── neon-card.tsx         # Glowing card components
├── glitch-text.tsx       # Animated text effects
└── web3-background.tsx   # Particle animation background
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- pnpm (recommended) or npm
- MetaMask or compatible Web3 wallet
- Core Chain network configured

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/corefluidx/corefluidx-protocol.git
   cd corefluidx-protocol
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

4. **Run the development server**
   ```bash
   pnpm dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

### Environment Variables

```env
# Core Chain Configuration
NEXT_PUBLIC_CORE_CHAIN_RPC=https://rpc.coredao.org
NEXT_PUBLIC_CHAIN_ID=1116

# Contract Addresses
NEXT_PUBLIC_ULP_MANAGER_ADDRESS=0x...
NEXT_PUBLIC_RISK_ENGINE_ADDRESS=0x...
NEXT_PUBLIC_ORACLE_ROUTER_ADDRESS=0x...

# API Keys
NEXT_PUBLIC_COINGECKO_API_KEY=your_api_key_here
```

## 📊 Protocol Statistics

- **Total Value Locked**: $12.5M+
- **Active Users**: 2,847+
- **Integrated Protocols**: 15+
- **Average APY**: 13.2%
- **Security Audits**: 3 completed

## 🎯 Roadmap

### Q1 2024
- [x] Core protocol development
- [x] Smart contract audits
- [x] Frontend implementation
- [ ] Mainnet deployment

### Q2 2024
- [ ] Mobile app release
- [ ] Advanced analytics dashboard
- [ ] Cross-chain bridge integration
- [ ] Governance token launch

### Q3 2024
- [ ] Institutional features
- [ ] API for third-party integrations
- [ ] Advanced trading strategies
- [ ] Insurance protocol integration

## 🤝 Contributing

We welcome contributions from the community! Please read our [Contributing Guidelines](CONTRIBUTING.md) before submitting pull requests.

### Development Workflow

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 🔐 Security

Security is our top priority. If you discover a security vulnerability, please send an email to security@corefluidx.com. Do not create a public issue.

### Audit Reports
- [Audit Report 1](docs/audits/audit-report-1.pdf) - CertiK
- [Audit Report 2](docs/audits/audit-report-2.pdf) - Quantstamp
- [Audit Report 3](docs/audits/audit-report-3.pdf) - OpenZeppelin

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🌐 Links

- **Website**: [https://corefluidx.com](https://corefluidx.com)
- **Documentation**: [https://docs.corefluidx.com](https://docs.corefluidx.com)
- **Twitter**: [@CoreFluidX](https://twitter.com/CoreFluidX)
- **Discord**: [Join our community](https://discord.gg/corefluidx)
- **Telegram**: [CoreFluidX Official](https://t.me/corefluidx)

## 💬 Support

Need help? Reach out to us:
- **Email**: support@corefluidx.com
- **Discord**: Join our [Discord server](https://discord.gg/corefluidx)
- **Documentation**: Check our [docs](https://docs.corefluidx.com)

---

**Built with ❤️ by the CoreFluidX Team for the Core Chain ecosystem**

*Disclaimer: This is experimental DeFi software. Use at your own risk. Always do your own research before investing.*