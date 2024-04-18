import { Address } from '@graphprotocol/graph-ts'
import { Mint, RfqTrade }from '../generated/NativeXSupply/NativeX'
import { AquaSupplyEntity, NativeXSwapEntity } from '../generated/schema'



export function handleAquaSupply(event: Mint): void {
  let entity = new AquaSupplyEntity(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )

  entity.account = event.params.minter
  entity.mintAmount = event.params.mintAmount
  entity.mintTokens = event.params.mintTokens
  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

const ARB_ARB = Address.fromString('0xcb70533c9635060275F1A97539dda2E3f8bFac42')
const MANTA = Address.fromString('0xF5d3953a33F78E0412A8988FD77B4920AA968B0b')
const STONE_MANTA = Address.fromString('0xDeEC33dc735Baf36b473598C33BCD077A0f32049')
const WSTETH_ETH = Address.fromString('0xfe8C940B936E3520e314574418585687c3BbAA12')
const USDT_ARB = Address.fromString('0x012726F9f458a63f86055b24E67BA0aa26505028')
const supported_assets = [ARB_ARB, MANTA, STONE_MANTA, WSTETH_ETH, USDT_ARB]

export function handleNativeXSwap(event: RfqTrade): void {
  let entity = new NativeXSwapEntity(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  const buyerToken =  event.params.buyerToken
  const sellerToken = event.params.sellerToken

  if(supported_assets.includes(buyerToken) || supported_assets.includes(sellerToken)) {
    entity.buyerToken = event.params.buyerToken
    entity.buyerTokenAmount = event.params.buyerTokenAmount
    entity.sellerToken = event.params.sellerToken
    entity.sellerTokenAmount = event.params.sellerTokenAmount
    entity.quoteId = event.params.quoteId
    entity.recipient = event.params.recipient
    entity.signer = event.params.signer
    entity.blockNumber = event.block.number
    entity.blockTimestamp = event.block.timestamp
    entity.transactionHash = event.transaction.hash

    entity.save()
  }
}

  