"use client"

import { useState } from "react"
import AddWalletForm from "./components/AddWalletForm"
import Portfolio from "./components/Portfolio"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import type { Network } from "./services/cryptoService";



export function isValidWalletAddress(address: string, network: Network): boolean {


  switch (network) {

    case 'ethereum':

      return /^0x[a-fA-F0-9]{40}$/.test(address);

    case 'bitcoin':

      return /^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$/.test(address);

    default:

      return false;

  }

}

export default function Home() {
  const [currentWallet, setCurrentWallet] = useState<{ address: string; network: Network } | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleAddWallet = (address: string, network: Network) => {
    if (!isValidWalletAddress(address, network)) {
      setError(`Invalid ${network} wallet address format`)
      return
    }
    setError(null)
    setCurrentWallet({ address, network })
  }

  return (
    <div className="h-screen w-screen flex bg-slate-300 text-white justify-center ">
    <div className="container mx-auto  mb-auto mt-16 overflow-auto shadow-2xl border-slate-950 bg-slate-900 p-9 rounded-lg">
      <h1 className="text-4xl font-bold mb-8">Multi-Network Crypto Wallet Tracker</h1>
      <AddWalletForm onAddWallet={handleAddWallet} />
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      {currentWallet && <Portfolio address={currentWallet.address} network={currentWallet.network} />}
    </div>
    </div>
  )
}

