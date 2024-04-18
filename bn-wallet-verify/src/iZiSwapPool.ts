import { BigInt } from '@graphprotocol/graph-ts';
import { Swap }from '../generated/iZiSwapUSDT_ETH/iZiSwapPool'
import { IZiSwapPoolEntity } from '../generated/schema'

export function handleIZiSwapUSD(event: Swap): void {
  let entity = new IZiSwapPoolEntity(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )

  const usdValue = event.params.amountX.lt(event.params.amountY) ? event.params.amountX : event.params.amountY 
  entity.account = event.transaction.from
  entity.tokenX = event.params.tokenX
  entity.tokenY = event.params.tokenY
  entity.fee = event.params.fee
  entity.amountX = event.params.amountX
  entity.amountY = event.params.amountY
  entity.verified = usdValue.ge(BigInt.fromI32(5000000)) ? true : false
  entity.currentPoint = event.params.currentPoint
  entity.sellXEarnY = event.params.sellXEarnY
  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}