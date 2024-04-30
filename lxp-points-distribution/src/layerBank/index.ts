import { LToken, Transfer } from '../../generated/LayerBank/LToken'
import { PoolTokenPosition, Pool } from '../../generated/schema'
import { Address, BigInt } from '@graphprotocol/graph-ts'
import { SPECIAL_ADDRESS } from '../constants'
import { setUserInvalid } from '../general'
import { fetchTokenSymbol } from './utils/tokenHelper'

export function handleTransfer(event: Transfer): void {
  setUserInvalid(event.address)
  const lToken = LToken.bind(event.address)
  let pool = Pool.load(event.address)
  if (!pool) {
    pool = new Pool(event.address)
    pool.symbol = lToken.underlying().equals(Address.zero()) ? "ETH" : fetchTokenSymbol(lToken.underlying())
    pool.underlying = lToken.underlying()
    pool.poolName = 'LayerBank'
    pool.decimals = BigInt.fromI32(lToken.decimals())
    pool.balance = BigInt.zero()
    pool.totalSupplied = BigInt.zero()
    pool.save()
  }
  // update from to
  if (event.params.from.notEqual(Address.zero()) && !SPECIAL_ADDRESS.includes(event.params.from)) {
    updateTokenPosition(event.params.from, event, pool)
  }

  // update to address
  if (event.params.to.notEqual(Address.zero()) && !SPECIAL_ADDRESS.includes(event.params.to)) {
    updateTokenPosition(event.params.to, event, pool)
  }
}

function updateTokenPosition(user: Address, event: Transfer, pool: Pool): void {
  const lToken = LToken.bind(event.address)

  // update pool
  pool.balance = lToken.getCash()
  pool.totalSupplied = lToken.totalSupply();
  pool.save()

  const poolTokenPositionId = user.concat(pool.underlying).concat(pool.id)
  let poolTokenPosition = PoolTokenPosition.load(poolTokenPositionId)
  if (!poolTokenPosition) {
    poolTokenPosition = new PoolTokenPosition(poolTokenPositionId)
  }
  poolTokenPosition.token = pool.underlying
  poolTokenPosition.pool = pool.id
  poolTokenPosition.supplied = lToken.balanceOf(user)
  poolTokenPosition.userPosition = user
  poolTokenPosition.save()
}



