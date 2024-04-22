import { BigInt } from '@graphprotocol/graph-ts'
import { Mint, Redeem, AquaLpToken } from '../generated/Aqua/AquaLpToken'
import { AquaMarket, Position, UserPosition } from '../generated/schema'


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

    let userPosition = UserPosition.load(event.params.minter)
    if (!userPosition) {
        userPosition = new UserPosition(
            event.params.minter
        )
    }
    userPosition.blockNumber = event.block.number
    userPosition.blockTimestamp = event.block.timestamp
    userPosition.transactionHash = event.transaction.hash
    userPosition.save()

    const aquaLpToken = AquaLpToken.bind(event.address)
    const underlyingToken = aquaLpToken.underlying()
    const underlyingTotalBalance = aquaLpToken.getCash()
    const underlyingBalance = aquaLpToken.balanceOf(event.params.minter)

    const positionId = event.params.minter.concat(underlyingToken).concat(event.address)
    let position = Position.load(positionId)
    if (!position) {
        position = new Position(positionId)
    }
    position.amount = underlyingBalance
    position.shareBalance = position.amount.times(underlyingTotalBalance).div(aquaMarket.supply)
    position.pool = event.address
    position.token = underlyingToken
    position.user = event.params.minter
    position.save()
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

    let userPosition = UserPosition.load(event.params.redeemer)
    if (!userPosition) {
        userPosition = new UserPosition(
            event.params.redeemer
        )
    }
    userPosition.blockNumber = event.block.number
    userPosition.blockTimestamp = event.block.timestamp
    userPosition.transactionHash = event.transaction.hash
    userPosition.save()

    const aquaLpToken = AquaLpToken.bind(event.address)
    const underlyingToken = aquaLpToken.underlying()
    const underlyingTotalBalance = aquaLpToken.getCash()
    const underlyingBalance = aquaLpToken.balanceOf(event.params.redeemer)

    const positionId = event.params.redeemer.concat(underlyingToken).concat(event.address)
    let position = Position.load(positionId)
    if (!position) {
        position = new Position(positionId)
    }
    position.amount = underlyingBalance
    position.shareBalance = position.amount.times(underlyingTotalBalance).div(aquaMarket.supply)
    position.pool = event.address
    position.token = underlyingToken
    position.user = event.params.redeemer
    position.save()

}