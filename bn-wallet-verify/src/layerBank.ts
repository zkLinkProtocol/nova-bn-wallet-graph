import { Borrow, Mint} from '../generated/LayerBank/LayerBank'
import { LayerBankEntity} from '../generated/schema'

export function handleLayerBankSupply(event: Mint): void {
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
  