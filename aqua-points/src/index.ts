import { MarketListed } from '../generated/Aqua/AquaVault'
import { AquaLpToken, Transfer } from '../generated/templates/AquaLpToken/AquaLpToken'
import { PoolTokenPosition, Pool } from '../generated/schema'
import { AquaLpToken as AquaLpTokenLTokenTemplate } from '../generated/templates'
import { Address, BigInt } from '@graphprotocol/graph-ts'
import { setUserInvalid, updateUserBalance } from './general'
import { fetchTokenDecimals, fetchTokenSymbol } from './utils/tokenHelper'

export function handleMarketListed(event: MarketListed): void {
    const cToken = event.params.cToken
    const cTokenContract = AquaLpToken.bind(cToken)

    let pool = Pool.load(cToken)
    if (!pool) {
        pool = new Pool(cToken)
        pool.underlying = cTokenContract.underlying()
        pool.decimals = fetchTokenDecimals(cTokenContract.underlying())
        pool.balance = cTokenContract.getCash()
        pool.totalSupplied = cTokenContract.totalSupply()
        pool.symbol = fetchTokenSymbol(cTokenContract.underlying())
        pool.name = cTokenContract.name()
        pool.save()

        AquaLpTokenLTokenTemplate.create(cToken)
    }
}

export function handleTransfer(event: Transfer): void {
    setUserInvalid(event.address)

    const lToken = AquaLpToken.bind(event.address)
    const underlying = lToken.underlying()
    let pool = Pool.load(event.address)
    if (!pool) {
        pool = new Pool(event.address)
        pool.name = lToken.name()
        pool.symbol = fetchTokenSymbol(underlying)
        pool.underlying = underlying
        pool.decimals = fetchTokenDecimals(underlying)
        pool.balance = BigInt.zero()
        pool.totalSupplied = BigInt.zero()
        pool.save()
    } else {
        pool.symbol = fetchTokenSymbol(underlying)
        pool.underlying = underlying
        pool.decimals = fetchTokenDecimals(underlying)
        pool.save()
    }
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
    updateUserBalance(user, BigInt.zero())

    const lToken = AquaLpToken.bind(event.address)
    let poolBalance = lToken.getCash();

    pool.balance = poolBalance
    pool.totalSupplied = lToken.totalSupply();
    pool.save()


    const poolTokenPositionId = user.concat(pool.underlying).concat(pool.id)
    let poolTokenPosition = PoolTokenPosition.load(poolTokenPositionId)
    if (!poolTokenPosition) {
        poolTokenPosition = new PoolTokenPosition(poolTokenPositionId)
    }
    const supplied = lToken.balanceOf(user)
    poolTokenPosition.token = pool.underlying
    poolTokenPosition.pool = pool.id
    poolTokenPosition.poolName = lToken.name()
    poolTokenPosition.supplied = supplied
    poolTokenPosition.userPosition = user
    poolTokenPosition.save()
}



