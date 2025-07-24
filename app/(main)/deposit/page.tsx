"use client"

import { useState } from "react"
import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { TrendingUp, Shield, Zap } from "lucide-react"
import { NeonCard } from "@/components/neon-card"
import { CyberButton } from "@/components/cyber-button"
import { GlitchText } from "@/components/glitch-text"
import { usePortfolio } from "@/contexts/portfolio-context"
import { useToast } from "@/hooks/use-toast"
import { tokens, getTokenData, formatCurrency } from "@/lib/token-data"

export default function DepositPage() {
  const { state, dispatch } = usePortfolio()
  const { toast } = useToast()
  const [selectedToken, setSelectedToken] = useState("CORE")
  const [depositAmount, setDepositAmount] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)

  const selectedTokenData = getTokenData(selectedToken)
  const depositValueUSD = Number.parseFloat(depositAmount) * selectedTokenData.price || 0

  const handleDeposit = async () => {
    if (!state.isWalletConnected) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to make a deposit.",
        variant: "destructive",
      })
      return
    }

    if (!depositAmount || Number.parseFloat(depositAmount) <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid deposit amount.",
        variant: "destructive",
      })
      return
    }

    setIsProcessing(true)

    try {
      // Simulate transaction processing
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const newPosition = {
        id: `deposit-${Date.now()}`,
        type: "deposit" as const,
        token: selectedToken,
        amount: Number.parseFloat(depositAmount),
        valueUSD: depositValueUSD,
        apy: 8.5,
        timestamp: Date.now(),
      }

      dispatch({ type: "ADD_POSITION", payload: newPosition })

      toast({
        title: "Deposit Successful",
        description: `Successfully deposited ${depositAmount} ${selectedToken} (${formatCurrency(depositValueUSD)})`,
        variant: "default",
      })

      setDepositAmount("")
    } catch (error) {
      toast({
        title: "Deposit Failed",
        description: "Failed to process deposit. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <GlitchText text="DEPOSIT_ASSETS" className="text-3xl font-bold text-cyan-400" />
        <p className="text-gray-400 font-mono">[EARN_YIELD_ON_YOUR_DIGITAL_ASSETS.EXE]</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <NeonCard>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-cyan-400 font-mono">
                <Zap className="w-5 h-5" />
                DEPOSIT_INTERFACE
              </CardTitle>
              <CardDescription className="font-mono text-gray-400">
                Select asset and amount to deposit into the liquidity pool
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="token-select" className="text-cyan-400 font-mono">
                  SELECT_ASSET
                </Label>
                <Select value={selectedToken} onValueChange={setSelectedToken}>
                  <SelectTrigger className="bg-gray-900 border-cyan-500/30 text-white font-mono">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900 border-cyan-500/30">
                    {Object.entries(tokens).map(([symbol, data]) => (
                      <SelectItem key={symbol} value={symbol} className="text-white font-mono">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{data.icon}</span>
                          <span>{data.symbol}</span>
                          <span className="text-gray-400">- {data.name}</span>
                          <span className="text-cyan-400 ml-auto">{formatCurrency(data.price)}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount" className="text-cyan-400 font-mono">
                  DEPOSIT_AMOUNT
                </Label>
                <div className="relative">
                  <Input
                    id="amount"
                    type="number"
                    placeholder="0.00"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                    className="bg-gray-900 border-cyan-500/30 text-white font-mono text-lg pr-20"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-cyan-400 font-mono">
                    {selectedToken}
                  </div>
                </div>
                {depositValueUSD > 0 && (
                  <p className="text-sm text-gray-400 font-mono">≈ {formatCurrency(depositValueUSD)}</p>
                )}
              </div>

              <CyberButton
                onClick={handleDeposit}
                disabled={!state.isWalletConnected || !depositAmount || isProcessing}
                className="w-full"
              >
                {isProcessing ? "PROCESSING..." : "EXECUTE_DEPOSIT"}
              </CyberButton>
            </CardContent>
          </NeonCard>

          <NeonCard>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-cyan-400 font-mono">
                <TrendingUp className="w-5 h-5" />
                YIELD_OPPORTUNITIES
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {Object.entries(tokens)
                  .slice(0, 3)
                  .map(([symbol, data]) => (
                    <div key={symbol} className="p-4 bg-gray-900/50 rounded-lg border border-cyan-500/20">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-lg">{data.icon}</span>
                        <span className="font-mono text-white">{symbol}</span>
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400 font-mono">APY:</span>
                          <span className="text-green-400 font-mono">8.5%</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400 font-mono">TVL:</span>
                          <span className="text-cyan-400 font-mono">$2.1M</span>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </NeonCard>
        </div>

        <div className="space-y-6">
          <NeonCard>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-cyan-400 font-mono">
                <Shield className="w-5 h-5" />
                DEPOSIT_PREVIEW
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400 font-mono">Asset:</span>
                  <span className="text-white font-mono">{selectedToken}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400 font-mono">Amount:</span>
                  <span className="text-white font-mono">{depositAmount || "0.00"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400 font-mono">USD Value:</span>
                  <span className="text-cyan-400 font-mono">{formatCurrency(depositValueUSD)}</span>
                </div>
                <Separator className="bg-cyan-500/20" />
                <div className="flex justify-between">
                  <span className="text-gray-400 font-mono">Est. APY:</span>
                  <span className="text-green-400 font-mono">8.5%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400 font-mono">Daily Earnings:</span>
                  <span className="text-green-400 font-mono">{formatCurrency((depositValueUSD * 0.085) / 365)}</span>
                </div>
              </div>

              <div className="p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                <p className="text-xs text-blue-400 font-mono">
                  [INFO] Deposits are secured by multi-signature smart contracts and earn compound interest.
                </p>
              </div>
            </CardContent>
          </NeonCard>

          <NeonCard>
            <CardHeader>
              <CardTitle className="text-cyan-400 font-mono">PROTOCOL_STATS</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400 font-mono">Total TVL:</span>
                <span className="text-cyan-400 font-mono">$12.5M</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400 font-mono">Active Users:</span>
                <span className="text-cyan-400 font-mono">2,847</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400 font-mono">Avg APY:</span>
                <span className="text-green-400 font-mono">8.2%</span>
              </div>
            </CardContent>
          </NeonCard>
        </div>
      </div>
    </div>
  )
}
