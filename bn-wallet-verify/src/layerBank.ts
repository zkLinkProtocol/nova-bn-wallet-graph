import { Borrow, Mint } from '../generated/LayerBank/LayerBank'
import { LayerBankEntity } from '../generated/schema'
import { END_TIME, START_TIME } from './constant'

export function handleLayerBankSupply(event: Mint): void {
  if (event.block.timestamp.lt(START_TIME)) {
    return
  }

  if (event.block.timestamp.gt(END_TIME)) {
    return
  }

  let entity = new LayerBankEntity(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.account = event.params.minter
  entity.amount = event.params.mintAmount
  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}


export function handleLayerBankBorrow(event: Borrow): void {
  if (event.block.timestamp.lt(START_TIME)) {
    return
  }

  if (event.block.timestamp.gt(END_TIME)) {
    return
  }

  let entity = new LayerBankEntity(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.account = event.params.account
  entity.amount = event.params.ammount
  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
