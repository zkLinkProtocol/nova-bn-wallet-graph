
import { AddLiquidity, DecLiquidity } from '../generated/iZiSwapLiquidityManager/iZiSwapLiquidityManager'
import { UserPosition, Position, Pool } from '../generated/schema';
import { fetchTokenBalanceAmount } from './utils/tokenHelper';

export function handleAddLiquidity(event: AddLiquidity): void {
  genOrUpdateUserLatestPositionByAddLiquidity(event)
  increasePosition(event)
}

export function handleRemoveLiquidity(event: DecLiquidity): void {
  genOrUpdateUserLatestPositionByDecLiquidity(event)
  decreasePosition(event)
}

function increasePosition(event: AddLiquidity): void {
  let poolEntity = Pool.load(event.params.pool)
  if (!poolEntity) return
  const poolTokenXBalance = fetchTokenBalanceAmount(poolEntity.tokenX.toHexString(), poolEntity.id.toHexString())
  const poolTokenYBalance = fetchTokenBalanceAmount(poolEntity.tokenY.toHexString(), poolEntity.id.toHexString())
  poolEntity.amountX = poolEntity.amountX.plus(event.params.amountX)
  poolEntity.amountY = poolEntity.amountY.plus(event.params.amountY)
  poolEntity.blockNumber = event.block.number
  poolEntity.blockTimestamp = event.block.timestamp
  poolEntity.transactionHash = event.transaction.hash
  poolEntity.save()
  
  // genOrUpdateAddress(event.transaction.from)
  // update tokenX
  const positionXId = event.transaction.from.concat(poolEntity.tokenX).concat(event.params.pool)
  let positionX = Position.load(positionXId)
  if (!positionX) {
    positionX = new Position(positionXId)
    positionX.amount = event.params.amountX
  } else {
    positionX.amount = positionX.amount.plus(event.params.amountX)
  }
  positionX.shareBalance = positionX.amount.times(poolTokenXBalance).div(poolEntity.amountX)
  positionX.pool = event.params.pool
  positionX.token = poolEntity.tokenX
  positionX.user = event.transaction.from
  positionX.save()

  // // update tokenY
  const positionYId = event.transaction.from.concat(poolEntity.tokenY).concat(event.params.pool)
  let positionY = Position.load(positionYId)
  if (!positionY) {
    positionY = new Position(positionYId)
    positionY.amount = event.params.amountY
  } else {
    positionY.amount = positionY.amount.plus(event.params.amountY)
  }
  positionY.shareBalance = positionY.amount.times(poolTokenYBalance).div(poolEntity.amountY)
  positionY.pool = event.params.pool
  positionY.token = poolEntity.tokenY
  positionY.user = event.transaction.from
  positionY.save()
}

function decreasePosition(event: DecLiquidity): void {
  let poolEntity = Pool.load(event.params.pool)
  if (!poolEntity) return
  const poolTokenXBalance = fetchTokenBalanceAmount(poolEntity.tokenX.toHexString(), poolEntity.id.toHexString())
  const poolTokenYBalance = fetchTokenBalanceAmount(poolEntity.tokenY.toHexString(), poolEntity.id.toHexString())
  poolEntity.amountX = poolEntity.amountX.plus(event.params.amountX)
  poolEntity.amountY = poolEntity.amountY.plus(event.params.amountY)
  poolEntity.blockNumber = event.block.number
  poolEntity.blockTimestamp = event.block.timestamp
  poolEntity.transactionHash = event.transaction.hash
  poolEntity.save()
  
  // update tokenX
  const positionXId = event.transaction.from.concat(poolEntity.tokenX).concat(event.params.pool)
  let positionX = Position.load(positionXId)
  if (!positionX) {
    positionX = new Position(positionXId)
    positionX.amount = positionX.amount.times(poolTokenXBalance).div(poolEntity.amountX)
  } else {
    positionX.amount = positionX.amount.minus(event.params.amountX)
  }
  positionX.shareBalance = poolEntity.amountX
  positionX.pool = event.params.pool
  positionX.token = poolEntity.tokenX
  positionX.user = event.transaction.from
  positionX.save()

  // update tokenY
  const positionYId = event.transaction.from.concat(poolEntity.tokenY).concat(event.params.pool)
  let positionY = Position.load(positionYId)
  if (!positionY) {
    positionY = new Position(positionYId)
    positionY.amount = event.params.amountY
  } else {
    positionY.amount = positionY.amount.minus(event.params.amountY)
  }
  positionY.shareBalance = positionY.amount.times(poolTokenYBalance).div(poolEntity.amountY)
  positionY.pool = event.params.pool
  positionY.token = poolEntity.tokenY
  positionY.user = event.transaction.from
  positionY.save()
}


function genOrUpdateUserLatestPositionByAddLiquidity(event: AddLiquidity):void {
  let userPosition = UserPosition.load(event.transaction.from)
  if (!userPosition) {
    userPosition = new UserPosition(
      event.transaction.from
    )
  }

  userPosition.blockNumber = event.block.number
  userPosition.blockTimestamp = event.block.timestamp
  userPosition.transactionHash = event.transaction.hash
  userPosition.save()
}

function genOrUpdateUserLatestPositionByDecLiquidity(event: DecLiquidity):void  {
  let userPosition = UserPosition.load(event.transaction.from)
  if (!userPosition) {
    userPosition = new UserPosition(
      event.transaction.from
    )
  }

  userPosition.blockNumber = event.block.number
  userPosition.blockTimestamp = event.block.timestamp
  userPosition.transactionHash = event.transaction.hash
  userPosition.save()
}









