import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type Transaction = {
  hash: string
  from: string
  to: string
  value: string
}

type Wallet = {
  address: string
  balance: string
  transactions: Transaction[]
}

type WalletCardProps = {
  wallet: Wallet
}

export default function WalletCard({ wallet }: WalletCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{wallet.address}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-bold mb-4">{wallet.balance} ETH</p>
        <h3 className="text-lg font-semibold mb-2">Recent Transactions</h3>
        {wallet.transactions.length > 0 ? (
          <ul className="space-y-2">
            {wallet.transactions.slice(0, 3).map((tx, index) => (
              <li key={index} className="text-sm">
                <span className="font-medium">{Number(tx.value) / 1e18} ETH</span> to{" "}
                <span className="font-medium">
                  {tx.to.slice(0, 6)}...{tx.to.slice(-4)}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p>No recent transactions</p>
        )}
      </CardContent>
    </Card>
  )
}

