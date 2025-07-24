export interface TokenData {
  symbol: string
  name: string
  price: number
  decimals: number
  icon: string
  color: string
}

export const tokens: Record<string, TokenData> = {
  CORE: {
    symbol: "CORE",
    name: "Core",
    price: 1.25,
    decimals: 18,
    icon: "🔥",
    color: "from-orange-500 to-red-500",
  },
  ETH: {
    symbol: "ETH",
    name: "Ethereum",
    price: 2450.0,
    decimals: 18,
    icon: "⟠",
    color: "from-blue-500 to-purple-500",
  },
  WBTC: {
    symbol: "WBTC",
    name: "Wrapped Bitcoin",
    price: 43500.0,
    decimals: 8,
    icon: "₿",
    color: "from-yellow-500 to-orange-500",
  },
  USDC: {
    symbol: "USDC",
    name: "USD Coin",
    price: 1.0,
    decimals: 6,
    icon: "💵",
    color: "from-green-500 to-blue-500",
  },
  USDT: {
    symbol: "USDT",
    name: "Tether USD",
    price: 1.0,
    decimals: 6,
    icon: "💰",
    color: "from-green-500 to-teal-500",
  },
  DAI: {
    symbol: "DAI",
    name: "Dai Stablecoin",
    price: 1.0,
    decimals: 18,
    icon: "🏛️",
    color: "from-yellow-500 to-green-500",
  },
}

export function getTokenData(symbol: string): TokenData {
  return tokens[symbol] || tokens.CORE
}

export function convertToUSD(amount: number, tokenSymbol: string): number {
  const tokenData = getTokenData(tokenSymbol)
  return amount * tokenData.price
}

export function convertFromUSD(usdAmount: number, tokenSymbol: string): number {
  const tokenData = getTokenData(tokenSymbol)
  return usdAmount / tokenData.price
}

export function formatCurrency(amount: number, currency = "USD"): string {
  if (currency === "USD") {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount)
  }

  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 6,
  }).format(amount)
}

export function formatCurrencyPrecise(amount: number, currency = "USD", decimals = 8): string {
  if (currency === "USD") {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(amount)
  }

  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(amount)
}
