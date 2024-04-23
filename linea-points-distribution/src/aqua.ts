/** viewed */

import { BigInt } from '@graphprotocol/graph-ts'
import { Mint, Redeem, AquaLpToken } from '../generated/Aqua/AquaLpToken'
import { AquaMarket } from '../generated/schema'
import { genOrUpdatePoolTokenPosition } from './general'


export function handleSupply(event: Mint): void {
    let aquaMarket = AquaMarket.load(event.address)
    if (!aquaMarket) {
        aquaMarket = new AquaMarket(event.address)
        aquaMarket.supply = BigInt.zero()
        aquaMarket.blockNumber = event.block.number
        aquaMarket.blockTimestamp = event.block.timestamp
        aquaMarket.transactionHash = event.transaction.hash
    }

    aquaMarket.supply = aquaMarket.supply.plus(event.params.mintAmount)
    aquaMarket.save()

    const aquaLpToken = AquaLpToken.bind(event.address)
    const underlyingToken = aquaLpToken.underlying()
    const underlyingTotalBalance = aquaLpToken.getCash()
    const underlyingBalance = aquaLpToken.balanceOf(event.params.minter)
    const sharedBalance = underlyingBalance.times(underlyingTotalBalance).div(aquaMarket.supply)

    genOrUpdatePoolTokenPosition(event.params.minter, underlyingToken, event.address, underlyingBalance, sharedBalance)

}

export function handleWithdraw(event: Redeem): void {
    let aquaMarket = AquaMarket.load(event.address)
    if (!aquaMarket) {
        aquaMarket = new AquaMarket(event.address)
        aquaMarket.supply = BigInt.zero()
        aquaMarket.blockNumber = event.block.number
        aquaMarket.blockTimestamp = event.block.timestamp
        aquaMarket.transactionHash = event.transaction.hash
    }
    aquaMarket.supply = aquaMarket.supply.minus(event.params.redeemAmount)
    aquaMarket.save()

    const aquaLpToken = AquaLpToken.bind(event.address)
    const underlyingToken = aquaLpToken.underlying()
    const underlyingTotalBalance = aquaLpToken.getCash()
    const underlyingBalance = aquaLpToken.balanceOf(event.params.redeemer)
    const sharedBalance = underlyingBalance.times(underlyingTotalBalance).div(aquaMarket.supply)

    genOrUpdatePoolTokenPosition(event.params.redeemer, underlyingToken, event.address, underlyingBalance, sharedBalance)

}