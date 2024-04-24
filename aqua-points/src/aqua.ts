/** viewed */

import { AquaVault, Transfer } from '../generated/Aqua/AquaVault'
import { UserPosition, TokenPosition } from '../generated/schema'
import { Address, BigInt, Bytes } from '@graphprotocol/graph-ts'
import { fetchTokenBalanceAmount, fetchTokenDecimals } from './utils/tokenHelper'

export function handleTransfer(event: Transfer): void {


    // update from
    if (event.params.from.notEqual(event.address)) {
        updateTokenPosition(event.address, event.params.from, event.block.hash, event.block.number)
    }

    // update to address
    if (event.params.to.notEqual(event.address)) {
        updateTokenPosition(event.address, event.params.to, event.block.hash, event.block.number)
    }
}

function updateTokenPosition(pool: Address, user: Address, hash: Bytes, blockNumber: BigInt): void {

    let userPosition = UserPosition.load(user)
    if (!userPosition) {
        userPosition = new UserPosition(user)
        userPosition.save()
    }

    const aquaVault = AquaVault.bind(pool)
    const underlying = aquaVault.underlying()
    const totalBalance = fetchTokenBalanceAmount(underlying.toHexString(), pool.toHexString())
    const decimal = fetchTokenDecimals(underlying)

    const totalSupplied = aquaVault.totalSupply()
    const supplied = aquaVault.balanceOf(user)
    const balance = supplied.times(totalBalance).div(totalSupplied)

    const tokenPositionId = user.concat(Address.fromHexString(underlying.toHexString()))



    let tokenPosition = TokenPosition.load(tokenPositionId)
    if (!tokenPosition) {
        tokenPosition = new TokenPosition(user.concat(underlying))
    }
    tokenPosition.token = underlying
    tokenPosition.balance = balance
    tokenPosition.decimal = decimal
    tokenPosition.userPosition = userPosition.id
    tokenPosition.transactionHash = hash
    tokenPosition.blockNumber = blockNumber
    tokenPosition.save()
}

