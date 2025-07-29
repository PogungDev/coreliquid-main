# Core Testnet Wallet Information

## Deployment Wallet
- **Address**: `0x2c4bB3f1C250DA1b64a5Bc5AD2B0003C9A5F8a9b`
- **Private Key**: `0x16b71b93de162f7af28c557d3248560461d20e1547adb86f01a31acb05cc9c07`

## Cara Mendapatkan CORE Testnet

1. **Kunjungi Core Testnet Faucet**:
   - URL: https://scan.test.btcs.network/faucet
   - Atau: https://bridge.coredao.org/faucet

2. **Masukkan Address Wallet**:
   ```
   0x2c4bB3f1C250DA1b64a5Bc5AD2B0003C9A5F8a9b
   ```

3. **Request CORE Tokens**:
   - Klik "Get CORE" atau "Request"
   - Tunggu beberapa detik hingga transaksi selesai

4. **Verifikasi Balance**:
   ```bash
   cast balance 0x2c4bB3f1C250DA1b64a5Bc5AD2B0003C9A5F8a9b --rpc-url https://rpc.test.btcs.network
   ```

## Deploy SimpleToken

Setelah mendapatkan CORE dari faucet, jalankan:

```bash
cd simple_token_deploy
forge script script/Deploy.s.sol --rpc-url https://rpc.test.btcs.network --broadcast --legacy --gas-price 2000000000
```

## Network Information
- **Network**: Core Testnet
- **Chain ID**: 1115
- **RPC URL**: https://rpc.test.btcs.network
- **Explorer**: https://scan.test.btcs.network

## Contract yang akan di-deploy
- **SimpleToken**: ERC20 token dengan nama "CoreLiquid Test Token" (CLT)
- **Initial Supply**: 1,000,000 CLT
- **Decimals**: 18