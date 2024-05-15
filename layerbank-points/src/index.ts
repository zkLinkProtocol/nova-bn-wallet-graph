import { MarketListed } from '../generated/LayerBank/LayerBankCore'
import { LayerBankLToken, Transfer } from '../generated/templates/LayerBankLToken/LayerBankLToken'
import { PoolTokenPosition, Pool } from '../generated/schema'
import { LayerBankLToken as LayerBankLTokenTemplate } from '../generated/templates'
import { Address, BigInt } from '@graphprotocol/graph-ts'
import { setUserInvalid, updateUserBalance } from './general'
import { fetchTokenDecimals, fetchTokenSymbol } from './utils/tokenHelper'

export function handleMarketListed(event: MarketListed): void {
    const gToken = event.params.gToken
    const lToken = LayerBankLToken.bind(gToken)

    let pool = Pool.load(gToken)
    if (!pool) {
        pool = new Pool(gToken)
        pool.underlying = lToken.underlying()
        pool.decimals = fetchTokenDecimals(lToken.underlying())
        pool.balance = lToken.getCash()
        pool.totalSupplied = lToken.totalSupply()
        pool.symbol = fetchTokenSymbol(lToken.underlying())
        pool.name = lToken.name()
        pool.save()

        LayerBankLTokenTemplate.create(gToken)
    }
}

export function handleTransfer(event: Transfer): void {
    setUserInvalid(event.address)

    const lToken = LayerBankLToken.bind(event.address)
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

    const lToken = LayerBankLToken.bind(event.address)
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



