import { MarketListed, MarketRedeem, MarketSupply } from '../generated/layerBank/layerBankCore'
import { LayerBankLToken } from '../generated/layerBank/LayerBankLToken'
import { LayerBankMarket, PoolTokenPosition, UserPosition } from '../generated/schema'

import { BigInt, Bytes } from '@graphprotocol/graph-ts';
import { genOrUpdatePoolTokenPosition } from './general';

export function handleMarketListed(event: MarketListed): void {
  const market = new LayerBankMarket(event.params.gToken)
  market.supply = BigInt.zero()
  market.blockNumber = event.block.number
  market.blockTimestamp = event.block.timestamp
  market.transactionHash = event.transaction.hash
  market.save()
}

export function handleMarketRedeem(event: MarketRedeem): void {
  const market = LayerBankMarket.load(event.params.gToken)
  if (!market) return
  market.supply = market.supply.minus(event.params.uAmount)
  market.save()

  const LToken = LayerBankLToken.bind(event.params.gToken)
  const underlyingToken = LToken.underlying()
  const underlyingTotalBalance = LToken.getCash()
  const underlyingBalance = LToken.underlyingBalanceOf(event.params.user)
  const sharedBalance = underlyingBalance.times(underlyingTotalBalance).div(market.supply)
  genOrUpdatePoolTokenPosition(event.params.user, underlyingToken, event.params.gToken, underlyingBalance, sharedBalance)
}

export function handleMarketSupply(event: MarketSupply): void {
  const market = LayerBankMarket.load(event.params.gToken)
  if (!market) return
  market.supply = market.supply.plus(event.params.uAmount)
  market.save()

  const LToken = LayerBankLToken.bind(event.params.gToken)
  const underlyingToken = LToken.underlying()
  const underlyingTotalBalance = LToken.getCash()
  const underlyingBalance = LToken.underlyingBalanceOf(event.params.user)
  const sharedBalance = underlyingBalance.times(underlyingTotalBalance).div(market.supply)

  genOrUpdatePoolTokenPosition(event.params.user, underlyingToken, event.params.gToken, underlyingBalance, sharedBalance)
}


