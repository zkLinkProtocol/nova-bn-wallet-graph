import { MarketListed, MarketRedeem, MarketSupply} from '../generated/layerBank/layerBankCore'
import { LayerBankMarket, Position, UserPosition } from '../generated/schema'

import { Address, BigInt, Bytes } from '@graphprotocol/graph-ts';
import { ERC20 } from '../generated/iZiSwapFactory/ERC20';

const ETH_ADDRESS = Bytes.fromHexString('0x000000000000000000000000000000000000800A')
const ETH_POOL_ADDRESS = Bytes.fromHexString('0xb666582F612692525C4027d2a8280Ac06a055a95')

export function handleMarketListed(event: MarketListed ): void {
    const market = new LayerBankMarket(event.params.gToken)
    market.supply = BigInt.zero()

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

    const positionId = event.transaction.from.concat(ETH_POOL_ADDRESS).concat(event.params.gToken)
  let position = Position.load(positionId)
  if (!position) {
    position = new Position(positionId)
    position.amount = event.params.uAmount
  } else {
    position.amount = position.amount.plus(event.params.uAmount)
  }
  const poolUnderlyingContract = ERC20.bind(Address.fromBytes(ETH_ADDRESS))
  const poolUnderlyingBalance = poolUnderlyingContract.try_balanceOf(event.params.gToken)
  position.shareBalance = position.amount.times(poolUnderlyingBalance.value).div(market.supply)
  position.pool = event.params.gToken
  position.token = ETH_ADDRESS
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

    const positionId = event.transaction.from.concat(ETH_POOL_ADDRESS).concat(event.params.gToken)
    let position = Position.load(positionId)
    if (!position) {
        position = new Position(positionId)
        position.amount = event.params.uAmount
    } else {
        position.amount = position.amount.plus(event.params.uAmount)
    }
    const poolUnderlyingContract = ERC20.bind(Address.fromBytes(ETH_ADDRESS))
    const poolUnderlyingBalance = poolUnderlyingContract.try_balanceOf(event.params.gToken)
    position.shareBalance = position.amount.times(poolUnderlyingBalance.value).div(market.supply)
    position.pool = event.params.gToken
    position.token = ETH_ADDRESS
    position.user = event.transaction.from
    position.save()
}


