"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Network } from "../services/cryptoService"

type AddWalletFormProps = {
  onAddWallet: (address: string, network: Network) => void
}

export default function AddWalletForm({ onAddWallet }: AddWalletFormProps) {
  const [address, setAddress] = useState("")
  const [network, setNetwork] = useState<Network>("ethereum")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (address.trim()) {
      onAddWallet(address.trim(), network)
      setAddress("")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mb-8">
      <div className="flex items-end gap-4">
        <div className="flex-1">
          <Label htmlFor="walletAddress">Wallet Address</Label>
          <Input
            id="walletAddress"
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Enter wallet address"
            required
          />
        </div>
        <div className="w-40">
          <Label htmlFor="network">Network</Label>
          <Select value={network} onValueChange={(value) => setNetwork(value as Network)}>
            <SelectTrigger id="network">
              <SelectValue placeholder="Select network" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ethereum">Ethereum</SelectItem>
              <SelectItem value="bitcoin">Bitcoin</SelectItem>
              <SelectItem value="litecoin">Litecoin</SelectItem>
              <SelectItem value="dogecoin">Dogecoin</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button type="submit">View Portfolio</Button>
      </div>
    </form>
  )
}

