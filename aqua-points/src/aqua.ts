/** viewed */

import { AquaVault, Transfer } from '../generated/Aqua/AquaVault'
import { UserPosition, TokenPosition, AquaCToken } from '../generated/schema'
import { Address, BigInt } from '@graphprotocol/graph-ts'
import { fetchTokenBalanceAmount, fetchTokenDecimals } from './utils/tokenHelper'

export function handleTransfer(event: Transfer): void {

    let aquaCToken = AquaCToken.load(event.address)
    if (!aquaCToken) {
        aquaCToken = new AquaCToken(event.address)
        aquaCToken.balance = BigInt.zero()
        aquaCToken.blockNumber = event.block.number
        aquaCToken.totalSupplied = BigInt.zero()
        aquaCToken.save()
    }
    // update from to
    if (event.params.from.notEqual(event.address)) {
        updateTokenPosition('from', event, aquaCToken)
    }

    // update to address
    if (event.params.to.notEqual(event.address)) {
        updateTokenPosition('to', event, aquaCToken)
    }
}

function updateTokenPosition(type: string, event: Transfer, aquaCToken: AquaCToken): void {
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
    aquaCToken.balance = totalBalance;
    aquaCToken.totalSupplied = aquaVault.totalSupply();
    aquaCToken.save()

    const supplied = aquaVault.balanceOf(user)
    const tokenPositionId = user.concat(Address.fromHexString(event.address.toHexString()))



    let tokenPosition = TokenPosition.load(tokenPositionId)
    if (!tokenPosition) {
        tokenPosition = new TokenPosition(user.concat(underlying))
    }
    tokenPosition.token = underlying
    tokenPosition.pool = pool
    tokenPosition.supplied = supplied
    tokenPosition.decimal = decimal
    tokenPosition.userPosition = userPosition.id
    tokenPosition.transactionHash = hash
    tokenPosition.blockNumber = blockNumber
    tokenPosition.save()
}

