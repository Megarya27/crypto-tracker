"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getWalletBalance, getWalletTransactions, getCoinPrice, type Network } from "../services/cryptoService"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

type Transaction = {
  hash: string
  from: string
  to: string
  value: string
  timeStamp: string
}

type PortfolioProps = {
  address: string
  network: Network
}

const networkToCoinId: Record<Network, string> = {
  ethereum: "ethereum",
  bitcoin: "bitcoin",
  litecoin: "litecoin",
  dogecoin: "dogecoin",
}

export default function Portfolio({ address, network }: PortfolioProps) {
  const [balance, setBalance] = useState<string | null>(null)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [coinPrice, setCoinPrice] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchWalletData = async () => {
      setLoading(true)
      setError(null)
      try {
        const [balanceData, transactionsData, coinPriceData] = await Promise.all([
          getWalletBalance(address, network),
          getWalletTransactions(address, network),
          getCoinPrice(networkToCoinId[network]),
        ])

        setBalance(balanceData)
        setTransactions(transactionsData)
        setCoinPrice(coinPriceData)
      } catch (error) {
        console.error("Error fetching wallet data:", error)
        setError(error instanceof Error ? error.message : "An unexpected error occurred")
      } finally {
        setLoading(false)
      }
    }

    fetchWalletData()
  }, [address, network])

  const formatDate = (timestamp: string) => {
    return new Date(Number.parseInt(timestamp) * 1000).toLocaleString()
  }

  if (loading) {
    return <div>Loading portfolio data...</div>
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  if (!balance || !coinPrice) {
    return <div>No data available for this address.</div>
  }

  const balanceUSD = Number.parseFloat(balance) * coinPrice

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="text-2xl">
          {network.charAt(0).toUpperCase() + network.slice(1)} Portfolio for {address}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-2">Balance</h3>
          <p className="text-3xl font-bold">
            {balance} {network.toUpperCase()}
          </p>
          <p className="text-xl text-muted-foreground">${balanceUSD.toFixed(2)} USD</p>
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-2">Recent Transactions</h3>
          {transactions.length > 0 ? (
            <ul className="space-y-4">
              {transactions.slice(0, 5).map((tx: any) => (
                <li key={tx.hash} className="border-b pb-2">
                  <p className="font-medium">
                    {Number(tx.value) / (network === "ethereum" ? 1e18 : 1e8)} {network.toUpperCase()}{" "}
                    <span className="text-muted-foreground">
                      (${((Number(tx.value) / (network === "ethereum" ? 1e18 : 1e8)) * coinPrice).toFixed(2)} USD)
                    </span>
                  </p>
                  <p className="text-sm text-muted-foreground">
                    To: {tx.to ? `${tx.to.slice(0, 6)}...${tx.to.slice(-4)}` : "Contract Creation"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(network === "ethereum" ? tx.timeStamp : tx.time)}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p>No recent transactions</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

