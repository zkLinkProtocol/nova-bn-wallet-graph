/** viewed */

import { AquaVault, Transfer } from '../generated/Aqua/AquaVault'
import { UserPosition, TokenPosition } from '../generated/schema'
import { Address, BigInt, Bytes } from '@graphprotocol/graph-ts'
import { fetchTokenBalanceAmount, fetchTokenDecimals } from './utils/tokenHelper'

export function handleTransfer(event: Transfer): void {


    // update from to
    if (event.params.from.notEqual(event.address)) {
        updateTokenPosition('from', event)
    }

    // update to address
    if (event.params.to.notEqual(event.address)) {
        updateTokenPosition('to', event)
    }
}

function updateTokenPosition(type: string, event: Transfer): void {
    const user = type === 'from' ? event.params.from : event.params.to
    const pool = event.address
    const hash = event.transaction.hash
    const blockNumber = event.block.number

    let userPosition = UserPosition.load(user)
    if (!userPosition) {
        userPosition = new UserPosition(user)
        userPosition.save()
    }

    const aquaVault = AquaVault.bind(pool)
    const vaultAddress = aquaVault.aquaVault()
    const underlying = aquaVault.underlying()
    const totalBalance = fetchTokenBalanceAmount(underlying.toHexString(), vaultAddress.toHexString())
    const decimal = fetchTokenDecimals(underlying)

    const totalSupplied = aquaVault.totalSupply()
    const supplied = aquaVault.balanceOf(user)
    const balance = totalSupplied.equals(BigInt.zero()) ? BigInt.zero() : supplied.times(totalBalance).div(totalSupplied)

    const tokenPositionId = user.concat(Address.fromHexString(underlying.toHexString()))



    let tokenPosition = TokenPosition.load(tokenPositionId)
    if (!tokenPosition) {
        tokenPosition = new TokenPosition(user.concat(underlying))
    }
    tokenPosition.token = underlying
    tokenPosition.pool = pool
    tokenPosition.balance = balance
    tokenPosition.decimal = decimal
    tokenPosition.userPosition = userPosition.id
    tokenPosition.transactionHash = hash
    tokenPosition.blockNumber = blockNumber
    tokenPosition.save()
}

