/** viewed */

import { AquaLpToken, Transfer } from '../../generated/Aqua/AquaLpToken'
import { PoolTokenPosition, Pool, PoolTokenPositionHistoryItem } from '../../generated/schema'
import { Address, BigInt } from '@graphprotocol/graph-ts'
import { fetchTokenBalanceAmount, fetchTokenSymbol } from './utils/tokenHelper'
import { setUserInvalid } from '../general'

export function handleTransfer(event: Transfer): void {
    setUserInvalid(event.address)

    let pool = Pool.load(event.address)
    if (!pool) {
        const aquaCToken = AquaLpToken.bind(event.address)
        pool = new Pool(event.address)
        pool.name = 'Aqua'
        pool.symbol = fetchTokenSymbol(Address.fromBytes(aquaCToken.underlying()))
        pool.underlying = aquaCToken.underlying()
        pool.decimals = BigInt.fromI32(aquaCToken.decimals())
        pool.balance = BigInt.zero()
        pool.totalSupplied = BigInt.zero()
        pool.save()
    }
    // update from to
    if (event.params.from.notEqual(event.address)) {
        updateTokenPosition(event.params.from, event, pool)
    }

    // update to address
    if (event.params.to.notEqual(event.address)) {
        updateTokenPosition(event.params.to, event, pool)
    }
}

function updateTokenPosition(user: Address, event: Transfer, pool: Pool): void {

    const aquaCToken = AquaLpToken.bind(Address.fromBytes(pool.id))
    const vaultAddress = aquaCToken.aquaVault()
    const underlying = aquaCToken.underlying()
    const totalBalance = fetchTokenBalanceAmount(underlying.toHexString(), vaultAddress.toHexString())


    pool.balance = totalBalance;
    pool.totalSupplied = aquaCToken.totalSupply();
    pool.save()

    const supplied = aquaCToken.balanceOf(user)
    const tokenPositionId = user.concat(Address.fromHexString(event.address.toHexString()))



    let poolTokenPosition = PoolTokenPosition.load(tokenPositionId)
    if (!poolTokenPosition) {
        poolTokenPosition = new PoolTokenPosition(user.concat(underlying))
    }
    poolTokenPosition.token = underlying
    poolTokenPosition.pool = pool.id
    poolTokenPosition.poolName = 'Aqua'
    poolTokenPosition.supplied = supplied
    poolTokenPosition.userPosition = user
    poolTokenPosition.save()

    const poolTokenPositionHistoricId = underlying.concat(event.transaction.hash)
    let poolTokenPositionHistoryItem = PoolTokenPositionHistoryItem.load(poolTokenPositionHistoricId)
    if (!poolTokenPositionHistoryItem) {
        poolTokenPositionHistoryItem = new PoolTokenPositionHistoryItem(poolTokenPositionHistoricId)
    }
    poolTokenPositionHistoryItem.token = pool.underlying
    poolTokenPositionHistoryItem.pool = pool.id
    poolTokenPositionHistoryItem.poolName = 'Aqua'
    poolTokenPositionHistoryItem.supplied = supplied
    poolTokenPositionHistoryItem.userPosition = user
    poolTokenPositionHistoryItem.blockNumber = event.block.number
    poolTokenPositionHistoryItem.blockTimestamp = event.block.timestamp
    poolTokenPositionHistoryItem.save()
}

