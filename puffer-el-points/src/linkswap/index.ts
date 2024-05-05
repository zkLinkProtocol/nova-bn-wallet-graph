import { Address, BigInt } from "@graphprotocol/graph-ts";
import { PairCreated } from "../../generated/linkswapFactory/linkswapFactory";
import { ERC20 } from '../../generated/linkswapFactory/ERC20'
import { Pool, PoolHistoricItem, PoolTokenPosition, PoolTokenPositionHistoryItem } from "../../generated/schema";
import { Transfer, LinkSwapPair } from "../../generated/templates/LinkSwap/LinkSwapPair";
import { LinkSwap as LinkSwapTemplate } from '../../generated/templates'
import { fetchTokenBalanceAmount } from "./utils/tokenHelper";
import { setUserInvalid } from '../general'

const pufETHAddress = Address.fromString('0x1B49eCf1A8323Db4abf48b2F5EFaA33F7DdAB3FC')

function genPool(token: Address, pair: Address): void {

  const id = token.concat(pair)
  let pool = Pool.load(id)
  if (!pool) {
    pool = new Pool(id)
    pool.underlying = token
    const erc20Token = ERC20.bind(token)
    pool.decimals = BigInt.fromI32(erc20Token.decimals())
    pool.symbol = erc20Token.symbol()
    pool.name = 'Linkswap'
    pool.balance = BigInt.zero()
    pool.totalSupplied = BigInt.zero()
    pool.save()
  }
}
export function handlePairCreated(event: PairCreated): void {
  genPool(event.params.token0, event.params.pair)
  genPool(event.params.token1, event.params.pair)
  LinkSwapTemplate.create(event.params.pair)
}

export function handleTransfer(event: Transfer): void {

  setUserInvalid(event.address)

  const swapPair = LinkSwapPair.bind(event.address)
  const pool0 = Pool.load(swapPair.token0().concat(event.address))
  const pool1 = Pool.load(swapPair.token1().concat(event.address))

  if (!pool0 || !pool1) return

  // update from to
  if (event.params.from.notEqual(Address.zero())) {
    if (pool0.underlying.equals(pufETHAddress)) {
      updateTokenPosition(event.params.from, event, pool0)
    }
    if (pool1.underlying.equals(pufETHAddress)) {
      updateTokenPosition(event.params.from, event, pool1)
    }
  }

  // update to address
  if (event.params.to.notEqual(Address.zero())) {
    if (pool0.underlying.equals(pufETHAddress)) {
      updateTokenPosition(event.params.to, event, pool0)
    }
    if (pool1.underlying.equals(pufETHAddress)) {
      updateTokenPosition(event.params.to, event, pool1)
    }
  }
}

function updateTokenPosition(user: Address, event: Transfer, pool: Pool): void {

  const poolUnderlying = pool.underlying
  const poolBalance = fetchTokenBalanceAmount(poolUnderlying.toHexString(), event.address.toHexString())
  const swapPair = LinkSwapPair.bind(event.address)

  // update pool
  pool.balance = poolBalance
  pool.totalSupplied = swapPair.totalSupply();
  pool.save()

  genHistoricPool(event, pool)

  const poolTokenPositionId = user.concat(pool.underlying).concat(pool.id)
  let poolTokenPosition = PoolTokenPosition.load(poolTokenPositionId)
  if (!poolTokenPosition) {
    poolTokenPosition = new PoolTokenPosition(poolTokenPositionId)
  }
  const supplied = swapPair.balanceOf(user)
  poolTokenPosition.token = pool.underlying
  poolTokenPosition.pool = pool.id
  poolTokenPosition.poolName = 'Linkswap'
  poolTokenPosition.supplied = supplied
  poolTokenPosition.userPosition = user
  poolTokenPosition.save()

  const poolTokenPositionHistoricId = pool.underlying.concat(event.transaction.hash)
  let poolTokenPositionHistoryItem = PoolTokenPositionHistoryItem.load(poolTokenPositionHistoricId)
  if (!poolTokenPositionHistoryItem) {
    poolTokenPositionHistoryItem = new PoolTokenPositionHistoryItem(poolTokenPositionHistoricId)
  }
  poolTokenPositionHistoryItem.token = pool.underlying
  poolTokenPositionHistoryItem.pool = pool.id
  poolTokenPositionHistoryItem.poolName = 'Linkswap'
  poolTokenPositionHistoryItem.supplied = supplied
  poolTokenPositionHistoryItem.userPosition = user
  poolTokenPositionHistoryItem.blockNumber = event.block.number
  poolTokenPositionHistoryItem.blockTimestamp = event.block.timestamp
  poolTokenPositionHistoryItem.save()
}

function genHistoricPool(event: Transfer, pool: Pool): void {
  const poolHistoricItem = new PoolHistoricItem(event.address.concat(event.transaction.hash))
  poolHistoricItem.pool = pool.id
  poolHistoricItem.name = pool.name
  poolHistoricItem.symbol = pool.symbol
  poolHistoricItem.underlying = pool.underlying
  poolHistoricItem.decimals = pool.decimals
  poolHistoricItem.balance = pool.balance
  poolHistoricItem.totalSupplied = pool.totalSupplied
  poolHistoricItem.blockNumber = event.block.number
  poolHistoricItem.blockTimestamp = event.block.timestamp
  poolHistoricItem.save()
}



