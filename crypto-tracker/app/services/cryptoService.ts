

const COINGECKO_API_URL = "https://api.coingecko.com/api/v3";
const ETHERSCAN_API_URL = "https://api.etherscan.io/api";
const ETHERSCAN_API_KEY = process.env.NEXT_PUBLIC_ETHERSCAN_API_KEY;
const BLOCKCHAIN_INFO_API_URL = "https://blockchain.info"
const BLOCKCHAIR_API_URL = "https://api.blockchair.com/bitcoin"

export type Network = "ethereum" | "bitcoin" | "litecoin" | "dogecoin"

export async function getCoinPrice(coinId: string): Promise<number> {
  try {
    const response = await fetch(`${COINGECKO_API_URL}/simple/price?ids=${coinId}&vs_currencies=usd`)
    const data = await response.json()
    return data[coinId].usd
  } catch (error) {
    console.error(`Error fetching ${coinId} price:`, error)
    throw new Error(`Failed to fetch ${coinId} price: ${error instanceof Error ? error.message : String(error)}`)
  }
}

export async function getWalletBalance(address: string, network: Network): Promise<string> {
  try {
    let balance: string

    switch (network) {
      case "ethereum":
        const ethResponse = await fetch(
          `${ETHERSCAN_API_URL}?module=account&action=balance&address=${address}&tag=latest&apikey=${ETHERSCAN_API_KEY}`,
        )
        const ethData = await ethResponse.json()
        if (ethData.status !== "1") {
          throw new Error(ethData.message || "Failed to fetch Ethereum wallet balance")
        }
        balance = (Number(ethData.result) / 1e18).toFixed(8)
        break

      case "bitcoin":
        const btcResponse = await fetch(`${BLOCKCHAIN_INFO_API_URL}/q/addressbalance/${address}`)
        const btcBalance = await btcResponse.text()
        balance = (Number(btcBalance) / 1e8).toFixed(8)
        break

      case "litecoin":
      case "dogecoin":
        const response = await fetch(`${BLOCKCHAIR_API_URL}/dashboards/address/${address}`)
        const data = await response.json()
        if (data.context.code !== 200) {
          throw new Error(`Failed to fetch ${network} wallet balance`)
        }
        balance = (Number(data.data[address].address.balance) / 1e8).toFixed(8)
        break

      default:
        throw new Error(`Unsupported network: ${network}`)
    }

    return balance
  } catch (error) {
    console.error(`Error fetching ${network} wallet balance:`, error)
    throw new Error(`Failed to fetch ${network} wallet balance: ${error instanceof Error ? error.message : String(error)}`)
  }
}

export async function getWalletTransactions(address: string, network: Network): Promise<any[]> {
  try {
    let transactions: any[]

    switch (network) {
      case "ethereum":
        const ethResponse = await fetch(
          `${ETHERSCAN_API_URL}?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&sort=desc&apikey=${ETHERSCAN_API_KEY}`,
        )
        const ethData = await ethResponse.json()
        if (ethData.status !== "1") {
          throw new Error(ethData.message || "Failed to fetch Ethereum wallet transactions")
        }
        transactions = ethData.result.slice(0, 10)
        break

      case "bitcoin":
        const btcResponse = await fetch(`${BLOCKCHAIN_INFO_API_URL}/rawaddr/${address}`)
        const btcData = await btcResponse.json()
        transactions = btcData.txs.slice(0, 10)
        break

      case "litecoin":
      case "dogecoin":
        const response = await fetch(`${BLOCKCHAIR_API_URL}/dashboards/address/${address}`)
        const data = await response.json()
        if (data.context.code !== 200) {
          throw new Error(`Failed to fetch ${network} wallet transactions`)
        }
        transactions = data.data[address].transactions.slice(0, 10)
        break

      default:
        throw new Error(`Unsupported network: ${network}`)
    }

    return transactions
  } catch (error) {
    console.error(`Error fetching ${network} wallet transactions:`, error)
    throw new Error(`Failed to fetch ${network} wallet transactions: ${error instanceof Error ? error.message : String(error)}`)
  }
}
