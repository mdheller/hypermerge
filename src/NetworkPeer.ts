import { DiscoveryId, encodeDiscoveryId } from './Misc'
import * as Base58 from 'bs58'

export type PeerId = DiscoveryId & { peerId: true }
type HypercoreProtocol = any

export default class NetworkPeer {
  id: PeerId
  protocol: HypercoreProtocol
  constructor(id: PeerId) {
    this.id = id
  }
}

export function encodePeerId(buffer: Buffer): PeerId {
  return encodeDiscoveryId(buffer) as PeerId
}

export function decodePeerId(id: PeerId): Buffer {
  return Base58.decode(id)
}
