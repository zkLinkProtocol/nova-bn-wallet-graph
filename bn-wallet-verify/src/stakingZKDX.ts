import { Stake as StakeUSDCEvent } from '../generated/ZKDXUSDC/ZKDX'
import { Stake as StakeETHEvent } from '../generated/ZKDXETH/ZKDX'
import { ZKDXStaking } from '../generated/schema'
import { BigInt } from '@graphprotocol/graph-ts'
import { END_TIME, START_TIME } from './constant'



export function handleZKDXStakingUSDC(event: StakeUSDCEvent): void {

  if (event.block.timestamp.lt(BigInt.fromI32(START_TIME))) {
    return
  }

  if (event.block.timestamp.gt(BigInt.fromI32(END_TIME))) {
    return
  }
  let entity = new ZKDXStaking(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.address = event.params.account
  entity.amount = event.params.amount
  entity.type = "USDC"
  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleZKDXStakingETH(event: StakeETHEvent): void {

  if (event.block.timestamp.lt(BigInt.fromI32(START_TIME))) {
    return
  }

  if (event.block.timestamp.gt(BigInt.fromI32(END_TIME))) {
    return
  }

  let entity = new ZKDXStaking(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.address = event.params.account
  entity.amount = event.params.amount
  entity.type = "ETH"
  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
