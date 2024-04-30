import { Address, BigInt } from "@graphprotocol/graph-ts";
import { PairCreated } from "../../generated/LinkswapFactory/LinkswapFactory";
import { Pool, PoolTokenPosition } from "../../generated/schema";
import { Transfer, LinkSwapPair } from "../../generated/templates/LinkSwap/LinkSwapPair";
import { LinkSwap as LinkSwapTemplate } from '../../generated/templates'
import { fetchTokenBalanceAmount, fetchTokenDecimals, fetchTokenSymbol } from "./utils/tokenHelper";
import { setUserInvalid } from "../general";
import { SPECIAL_ADDRESS } from "../constants";


function genPool(token: Address, pair: Address): void {
  const id = token.concat(pair)
  let pool = Pool.load(id)
  if (!pool) {
    pool = new Pool(id)
    pool.poolName = 'Linkswap'
    pool.underlying = token
    pool.decimals = fetchTokenDecimals(token)
    pool.symbol = fetchTokenSymbol(token)
    pool.balance = BigInt.zero()
    pool.totalSupplied = BigInt.zero()
    pool.save()
    LinkSwapTemplate.create(pair)
  }
}
export function handlePairCreated(event: PairCreated): void {
  genPool(event.params.token0, event.params.pair)
  genPool(event.params.token1, event.params.pair)
}

export function handleTransfer(event: Transfer): void {
  setUserInvalid(event.address)
  const swapPair = LinkSwapPair.bind(event.address)
  const pool0 = Pool.load(swapPair.token0().concat(event.address))
  const pool1 = Pool.load(swapPair.token1().concat(event.address))

  if (!pool0 || !pool1) return

  // update from to
  if (event.params.from.notEqual(Address.zero()) && !SPECIAL_ADDRESS.includes(event.params.from)) {
    updateTokenPosition(event.params.from, event, pool0)
    updateTokenPosition(event.params.from, event, pool1)
  }

  // update to address
  if (event.params.to.notEqual(Address.zero()) && !SPECIAL_ADDRESS.includes(event.params.to)) {
    updateTokenPosition(event.params.to, event, pool0)
    updateTokenPosition(event.params.to, event, pool1)
  }
}

function updateTokenPosition(user: Address, event: Transfer, pool: Pool): void {

  const swapPair = LinkSwapPair.bind(event.address)

  // update pool
  pool.balance = fetchTokenBalanceAmount(pool.underlying.toHexString(), event.address.toHexString())
  pool.totalSupplied = swapPair.totalSupply();
  pool.save()


  const poolTokenPositionId = user.concat(pool.underlying).concat(pool.id)
  let poolTokenPosition = PoolTokenPosition.load(poolTokenPositionId)
  if (!poolTokenPosition) {
    poolTokenPosition = new PoolTokenPosition(poolTokenPositionId)
  }
  const supplied = swapPair.balanceOf(user)
  poolTokenPosition.token = pool.underlying
  poolTokenPosition.pool = pool.id
  poolTokenPosition.supplied = supplied
  poolTokenPosition.userPosition = user
  poolTokenPosition.save()
}



