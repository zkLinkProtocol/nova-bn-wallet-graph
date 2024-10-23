import { MarketListed } from '../../generated/Aqua/AquaVault'
import { AquaLpToken, Transfer } from '../../generated/templates/AquaLpToken/AquaLpToken'
import { LiquidityPosition, Pool } from '../../generated/schema'
import { AquaLpToken as AquaLpTokenLTokenTemplate } from '../../generated/templates'
import { Address } from '@graphprotocol/graph-ts'
import { setUserInvalid, createUserBalance } from '../general'
import { fetchTokenDecimals, fetchTokenSymbol } from '../utils/tokenHelper'

export function handleMarketListed(event: MarketListed): void {
    const cToken = event.params.cToken
    const cTokenContract = AquaLpToken.bind(cToken)

    let pool = Pool.load(cToken)
    if (!pool) {
        pool = new Pool(cToken)
        const underlying = cTokenContract.try_underlying().value
        pool.underlying = underlying
        pool.decimals = fetchTokenDecimals(underlying)
        pool.balance = cTokenContract.try_getCash().value
        pool.totalSupplied = cTokenContract.try_totalSupply().value
        pool.symbol = fetchTokenSymbol(underlying)
        pool.name = cTokenContract.try_name().value
        pool.save()
        AquaLpTokenLTokenTemplate.create(cToken)
    }
}

export function handleTransfer(event: Transfer): void {
    setUserInvalid(event.address)

    const lToken = AquaLpToken.bind(event.address)
    const underlying = lToken.try_underlying().value
    let pool = Pool.load(event.address)
    if (!pool) {
        pool = new Pool(event.address)
        pool.name = lToken.try_name().value
        pool.symbol = fetchTokenSymbol(underlying)
        pool.underlying = underlying
        pool.decimals = fetchTokenDecimals(underlying)
    } else {
        pool.symbol = fetchTokenSymbol(underlying)
        pool.underlying = underlying
        pool.decimals = fetchTokenDecimals(underlying)
        pool.save()
    }
    pool.balance = lToken.try_getCash().value;
    pool.totalSupplied = lToken.try_totalSupply().value;
    pool.save()
    // update from to
    if (event.params.from.notEqual(Address.zero())) {
        updateTokenPosition(event.params.from, event, pool)
    }

    // update to address
    if (event.params.to.notEqual(Address.zero())) {
        updateTokenPosition(event.params.to, event, pool)
    }
}

function updateTokenPosition(user: Address, event: Transfer, pool: Pool): void {
    createUserBalance(user)

    const lToken = AquaLpToken.bind(event.address)
    const supplied = lToken.balanceOf(user)

    const poolTokenPositionId = user.concat(pool.underlying).concat(pool.id)
    let liquidityPosition = LiquidityPosition.load(poolTokenPositionId)
    if (!liquidityPosition) {
        liquidityPosition = new LiquidityPosition(poolTokenPositionId)
    }
    liquidityPosition.token = pool.underlying
    liquidityPosition.pool = pool.id
    liquidityPosition.poolName = lToken.name()
    liquidityPosition.supplied = supplied
    liquidityPosition.userPosition = user
    liquidityPosition.save()
}



