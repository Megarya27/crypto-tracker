"use client"

import { useState, useEffect } from "react"
import WalletCard from "./WalletCard"
import { getWalletBalance, getWalletTransactions } from "../services/cryptoService"

type Wallet = {
  address: string
  balance: string
  transactions: any[]
}

export default function WalletList() {
  const [wallets, setWallets] = useState<Wallet[]>([])

  useEffect(() => {
    const fetchWalletData = async () => {
      
      const trackedWallets = [
        "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
        "0x3f5CE5FBFe3E9af3971dD833D26bA9b5C936f0bE",
      ]

      const walletsData = await Promise.all(
        trackedWallets.map(async (address) => {
          const balance = await getWalletBalance(address, "ethereum")
          const transactions = await getWalletTransactions(address, "ethereum")
          return { address, balance, transactions }
        }),
      )

      setWallets(walletsData)
    }

    fetchWalletData()
  }, [])

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {wallets.map((wallet) => (
        <WalletCard key={wallet.address} wallet={wallet} />
      ))}
    </div>
  )
}

