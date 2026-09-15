import blockchainPucp from "@/assets/partners/blockchain-pucp.webp"
import blockchainUpc from "@/assets/partners/blockchain-upc.webp"
import dev3pack from "@/assets/partners/dev3pack.webp"
import ethLima from "@/assets/partners/eth-lima.webp"

export interface Partner {
  name: string
  logo: string
  width: number
  height: number
}

export const PARTNERS: Partner[] = [
  { name: "Club Blockchain UPC", logo: blockchainUpc, width: 400, height: 400 },
  { name: "Dev3pack", logo: dev3pack, width: 400, height: 400 },
  { name: "ETH Lima", logo: ethLima, width: 400, height: 165 },
  { name: "Club Blockchain PUCP", logo: blockchainPucp, width: 400, height: 400 },
]
