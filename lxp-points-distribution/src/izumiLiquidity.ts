
import { Address } from '@graphprotocol/graph-ts';
import { AddLiquidity, DecLiquidity } from '../generated/iZiSwapLiquidityManager/iZiSwapLiquidityManager'
import { PoolTokenPosition, Pool } from '../generated/schema';
import { genOrUpdatePoolTokenPosition } from './general';
import { fetchTokenBalanceAmount } from './utils/tokenHelper';

export function handleAddLiquidity(event: AddLiquidity): void {
  increasePosition(event)
}

export function handleRemoveLiquidity(event: DecLiquidity): void {
  decreasePosition(event)
}

function increasePosition(event: AddLiquidity): void {
  let poolEntity = Pool.load(event.params.pool)
  if (!poolEntity) return
  poolEntity.amountX = poolEntity.amountX.plus(event.params.amountX)
  poolEntity.amountY = poolEntity.amountY.plus(event.params.amountY)
  poolEntity.blockNumber = event.block.number
  poolEntity.blockTimestamp = event.block.timestamp
  poolEntity.transactionHash = event.transaction.hash
  poolEntity.save()

  const poolTokenXBalance = fetchTokenBalanceAmount(poolEntity.tokenX.toHexString(), poolEntity.id.toHexString())
  const poolTokenYBalance = fetchTokenBalanceAmount(poolEntity.tokenY.toHexString(), poolEntity.id.toHexString())

  // update tokenX
  const positionXId = event.transaction.from.concat(poolEntity.tokenX).concat(event.params.pool)
  let positionX = PoolTokenPosition.load(positionXId)
  if (!positionX) {
    const newSharedAmount = event.params.amountX.times(poolTokenXBalance).div(poolEntity.amountX)
    genOrUpdatePoolTokenPosition(event.transaction.from, poolEntity.tokenX, event.params.pool, event.params.amountX, newSharedAmount)
  } else {
    const newAmount = positionX.amount.plus(event.params.amountX)
    const newSharedAmount = newAmount.times(poolTokenXBalance).div(poolEntity.amountX)
    genOrUpdatePoolTokenPosition(event.transaction.from, poolEntity.tokenX, event.params.pool, newAmount, newSharedAmount)
  }

  // // update tokenY
  const positionYId = event.transaction.from.concat(poolEntity.tokenY).concat(event.params.pool)
  let positionY = PoolTokenPosition.load(positionYId)
  if (!positionY) {
    const newSharedAmount = event.params.amountY.times(poolTokenYBalance).div(poolEntity.amountY)
    genOrUpdatePoolTokenPosition(event.transaction.from, poolEntity.tokenY, event.params.pool, event.params.amountY, newSharedAmount)
  } else {
    const newAmount = positionY.amount.plus(event.params.amountY)
    const newSharedAmount = newAmount.times(poolTokenYBalance).div(poolEntity.amountY)
    genOrUpdatePoolTokenPosition(event.transaction.from, poolEntity.tokenY, event.params.pool, newAmount, newSharedAmount)
  }
}

function decreasePosition(event: DecLiquidity): void {
  let poolEntity = Pool.load(event.params.pool)
  if (!poolEntity) return
  poolEntity.amountX = poolEntity.amountX.minus(event.params.amountX)
  poolEntity.amountY = poolEntity.amountY.minus(event.params.amountY)
  poolEntity.blockNumber = event.block.number
  poolEntity.blockTimestamp = event.block.timestamp
  poolEntity.transactionHash = event.transaction.hash
  poolEntity.save()

  const poolTokenXBalance = fetchTokenBalanceAmount(poolEntity.tokenX.toHexString(), poolEntity.id.toHexString())
  const poolTokenYBalance = fetchTokenBalanceAmount(poolEntity.tokenY.toHexString(), poolEntity.id.toHexString())

  // update tokenX
  const positionXId = event.transaction.from.concat(poolEntity.tokenX).concat(event.params.pool)
  let positionX = PoolTokenPosition.load(positionXId)
  if (!positionX) {
    return // exception case
  } else {
    const newAmount = positionX.amount.minus(event.params.amountX)
    const newSharedAmount = newAmount.times(poolTokenXBalance).div(poolEntity.amountX)
    genOrUpdatePoolTokenPosition(event.transaction.from, poolEntity.tokenX, event.params.pool, newAmount, newSharedAmount)
  }

  // update tokenY
  const positionYId = event.transaction.from.concat(poolEntity.tokenY).concat(event.params.pool)
  let positionY = PoolTokenPosition.load(positionYId)
  if (!positionY) {
    return // exception case
  } else {
    const newAmount = positionY.amount.minus(event.params.amountY)
    const newSharedAmount = newAmount.times(poolTokenYBalance).div(poolEntity.amountY)
    genOrUpdatePoolTokenPosition(event.transaction.from, poolEntity.tokenY, event.params.pool, newAmount, newSharedAmount)
  }
}










