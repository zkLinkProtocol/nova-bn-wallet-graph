import { MarketListed, MarketRedeem, MarketSupply } from '../generated/layerBank/layerBankCore'
import { LayerBankLToken } from '../generated/layerBank/LayerBankLToken'
import { LayerBankMarket, Position, UserPosition } from '../generated/schema'

import { BigInt } from '@graphprotocol/graph-ts';

export function handleMarketListed(event: MarketListed ): void {
    const market = new LayerBankMarket(event.params.gToken)
    market.supply = BigInt.zero()
    market.blockNumber = event.block.number
    market.blockTimestamp = event.block.timestamp
    market.transactionHash = event.transaction.hash
    market.save()
}

export function handleMarketRedeem(event: MarketRedeem): void {
    const market = LayerBankMarket.load(event.params.gToken)
    if(!market) return
    market.supply = market.supply.minus(event.params.uAmount)
    market.save()
    let userPosition = UserPosition.load(event.params.user)
    if (!userPosition) {
      userPosition = new UserPosition(
        event.transaction.from
      )
    }
    userPosition.blockNumber = event.block.number
    userPosition.blockTimestamp = event.block.timestamp
    userPosition.transactionHash = event.transaction.hash
    userPosition.save()

    const LToken = LayerBankLToken.bind(event.params.gToken)
    const underlyingToken= LToken.underlying()
    const underlyingTotalBalance = LToken.getCash()
    const underlyingBalance = LToken.underlyingBalanceOf(event.params.user)
    
    const positionId = event.transaction.from.concat(underlyingToken).concat(event.params.gToken)
    let position = Position.load(positionId)
    if (!position) {
        position = new Position(positionId)
    } 
    position.amount = underlyingBalance
    position.shareBalance = position.amount.times(underlyingTotalBalance).div(market.supply)
    position.pool = event.params.gToken
    position.token = underlyingToken
    position.user = event.transaction.from
    position.save()
}

export function handleMarketSupply(event: MarketSupply): void {
    const market = LayerBankMarket.load(event.params.gToken)
    if(!market) return
    market.supply = market.supply.plus(event.params.uAmount)
    market.save()

    let userPosition = UserPosition.load(event.params.user)
    if (!userPosition) {
      userPosition = new UserPosition(
        event.transaction.from
      )
    }
    userPosition.blockNumber = event.block.number
    userPosition.blockTimestamp = event.block.timestamp
    userPosition.transactionHash = event.transaction.hash
    userPosition.save()

    const LToken = LayerBankLToken.bind(event.params.gToken)
    const underlyingToken= LToken.underlying()
    const underlyingTotalBalance = LToken.getCash()
    const underlyingBalance = LToken.underlyingBalanceOf(event.params.user)
    
    const positionId = event.transaction.from.concat(underlyingToken).concat(event.params.gToken)
    let position = Position.load(positionId)
    if (!position) {
        position = new Position(positionId)
    } 
    position.amount = underlyingBalance
    position.shareBalance = position.amount.times(underlyingTotalBalance).div(market.supply)
    position.pool = event.params.gToken
    position.token = underlyingToken
    position.user = event.transaction.from
    position.save()
}


