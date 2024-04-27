/** viewed */

import { AquaLpToken, Transfer } from '../../generated/Aqua/AquaLpToken'
import { UserPosition, PoolTokenPosition, Pool } from '../../generated/schema'
import { Address, BigInt } from '@graphprotocol/graph-ts'
import { fetchTokenBalanceAmount, fetchTokenSymbol } from './utils/tokenHelper'

export function handleTransfer(event: Transfer): void {

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
        updateTokenPosition('from', event, pool)
    }

    // update to address
    if (event.params.to.notEqual(event.address)) {
        updateTokenPosition('to', event, pool)
    }
}

function updateTokenPosition(type: string, event: Transfer, pool: Pool): void {
    const user = type === 'from' ? event.params.from : event.params.to

    const userPosition = getUserPosition(user)

    const aquaVault = AquaLpToken.bind(Address.fromBytes(pool.id))
    const vaultAddress = aquaVault.aquaVault()
    const underlying = aquaVault.underlying()
    const totalBalance = fetchTokenBalanceAmount(underlying.toHexString(), vaultAddress.toHexString())


    pool.balance = totalBalance;
    pool.totalSupplied = aquaVault.totalSupply();
    pool.save()

    const supplied = aquaVault.balanceOf(user)
    const tokenPositionId = user.concat(Address.fromHexString(event.address.toHexString()))



    let poolTokenPosition = PoolTokenPosition.load(tokenPositionId)
    if (!poolTokenPosition) {
        poolTokenPosition = new PoolTokenPosition(user.concat(underlying))
    }
    poolTokenPosition.token = underlying
    poolTokenPosition.pool = pool.id
    poolTokenPosition.poolName = 'Aqua'
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
