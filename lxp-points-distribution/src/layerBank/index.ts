/** viewed */

import { LToken, Transfer } from '../../generated/LayerBank/LToken'
import { L2EthToken } from '../../generated/LayerBank/L2EthToken'
import { UserPosition, PoolTokenPosition, Pool } from '../../generated/schema'
import { Address, BigInt } from '@graphprotocol/graph-ts'
import { fetchTokenSymbol } from '../aqua/utils/tokenHelper'
import { L1_ETH, L2_ETH, SPECIAL_ADDRESS } from '../constants'

export function handleTransfer(event: Transfer): void {
  const lToken = LToken.bind(event.address)
  const underlying = lToken.underlying()
  let pool = Pool.load(event.address)
  if (!pool) {
    pool = new Pool(event.address)
    pool.symbol = fetchTokenSymbol(Address.fromBytes(lToken.underlying()))
    pool.underlying = underlying.equals(L1_ETH) ? L2_ETH : underlying
    pool.decimals = BigInt.fromI32(lToken.decimals())
    pool.balance = BigInt.zero()
    pool.totalSupplied = BigInt.zero()
    pool.save()
  }
  // update from to
  if (event.params.from.notEqual(event.address) && !SPECIAL_ADDRESS.includes(event.params.from)) {
    updateTokenPosition(event.params.from, event, pool)
  }

  // update to address
  if (event.params.to.notEqual(event.address) && !SPECIAL_ADDRESS.includes(event.params.to)) {
    updateTokenPosition(event.params.to, event, pool)
  }
}

function updateTokenPosition(user: Address, event: Transfer, pool: Pool): void {

  // get user entity
  const userPosition = getUserPosition(user)

  const lToken = LToken.bind(event.address)

  // update pool
  const l2EthToken = L2EthToken.bind(L2_ETH)
  const poolBalance = l2EthToken.balanceOf(BigInt.fromUnsignedBytes(Address.fromBytes(pool.id)))

  pool.balance = poolBalance
  pool.totalSupplied = lToken.totalSupply();
  pool.save()

  const poolTokenPositionId = user.concat(pool.underlying).concat(pool.id)
  let poolTokenPosition = PoolTokenPosition.load(poolTokenPositionId)
  if (!poolTokenPosition) {
    poolTokenPosition = new PoolTokenPosition(poolTokenPositionId)
  }
  const supplied = lToken.balanceOf(user)
  poolTokenPosition.token = pool.underlying
  poolTokenPosition.pool = pool.id
  poolTokenPosition.supplied = supplied
  poolTokenPosition.userPosition = userPosition.id
  poolTokenPosition.save()
}

function getUserPosition(user: Address): UserPosition {
  let userPosition = UserPosition.load(user)
  if (!userPosition) {
    userPosition = new UserPosition(user)
    userPosition.save()
  }

  return userPosition
}

