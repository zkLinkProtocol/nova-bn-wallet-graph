/** viewed */

import { LToken, Transfer } from '../../generated/LayerBank/LToken'
import { L2EthToken } from '../../generated/LayerBank/L2EthToken'
import { UserPosition, PoolTokenPosition, Pool } from '../../generated/schema'
import { Address, BigInt, Bytes } from '@graphprotocol/graph-ts'
import { fetchTokenBalanceAmount, fetchTokenSymbol } from '../aqua/utils/tokenHelper'
import { ADDRESS_ZERO, L2_ETH, SPECIAL_ADDRESS } from '../constants'

const L1_ETH = ADDRESS_ZERO

export function handleTransfer(event: Transfer): void {
  const lToken = LToken.bind(event.address)
  const underlying = lToken.underlying()
  let pool = Pool.load(event.address)
  if (!pool) {
    pool = new Pool(event.address)
    pool.name = 'LayerBank'
    pool.symbol = fetchTokenSymbol(Address.fromBytes(lToken.underlying()))
    pool.underlying = underlying
    pool.decimals = BigInt.fromI32(lToken.decimals())
    pool.balance = BigInt.zero()
    pool.totalSupplied = BigInt.zero()
    pool.save()
  }
  // update from to
  if (event.params.from.notEqual(event.address) && !SPECIAL_ADDRESS.includes(event.params.from)) {
    updateTokenPosition('from', event, pool)
  }

  // update to address
  if (event.params.to.notEqual(event.address) && !SPECIAL_ADDRESS.includes(event.params.to)) {
    updateTokenPosition('to', event, pool)
  }
}

function updateTokenPosition(type: string, event: Transfer, pool: Pool): void {
  const user = type === 'from' ? event.params.from : event.params.to

  // get user entity
  const userPosition = getUserPosition(user)

  const lToken = LToken.bind(event.address)

  // update pool
  let poolBalance = BigInt.zero()

  if (pool.underlying.equals(Bytes.fromHexString(L1_ETH))) {
    const l2EthToken = L2EthToken.bind(Address.fromString(L2_ETH))
    poolBalance = l2EthToken.balanceOf(BigInt.fromUnsignedBytes(pool.id))

  } else {
    poolBalance = fetchTokenBalanceAmount(pool.underlying.toHexString(), pool.id.toHexString());

  }

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

