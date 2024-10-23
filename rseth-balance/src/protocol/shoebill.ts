import { MarketListed } from '../../generated/Shoebill/ShoebillUnitroller'
import { ShoebillSbToken, Transfer } from '../../generated/templates/ShoebillSbToken/ShoebillSbToken'
import { LiquidityPosition, Pool } from '../../generated/schema'
import { ShoebillSbToken as ShoebillSbTokenTemplate } from '../../generated/templates'
import { Address, BigInt, Bytes } from '@graphprotocol/graph-ts'
import { setUserInvalid, createUserBalance } from '../general'
import { fetchTokenDecimals, fetchTokenSymbol } from '../utils/tokenHelper'
import { ADDRESS_ZERO } from '../constants'

export function handleMarketListed(event: MarketListed): void {
    const gToken = event.params.gToken;
    let pool = Pool.load(Bytes.fromHexString(gToken.toHexString()));
    const lToken = ShoebillSbToken.bind(gToken);
    const underlying = lToken.try_underlying();

    const symbol = underlying.reverted ? 'ETH' : fetchTokenSymbol(underlying.value);

    if (!pool) {
        pool = new Pool(Bytes.fromHexString(gToken.toHexString()));
        pool.underlying = underlying.reverted ? ADDRESS_ZERO : underlying.value;
        pool.decimals = BigInt.fromI32(lToken.decimals());
        pool.balance = lToken.getCash();
        pool.totalSupplied = lToken.totalSupply();
        pool.symbol = symbol;
        pool.name = lToken.name();
        pool.save();
        ShoebillSbTokenTemplate.create(gToken);
    }
}

export function handleTransfer(event: Transfer): void {
    setUserInvalid(event.address)

    const lToken = ShoebillSbToken.bind(event.address)
    const underlyingCall = lToken.try_underlying();
    const symbol = underlyingCall.reverted ? 'ETH' : fetchTokenSymbol(underlyingCall.value);
    const underlying = underlyingCall.reverted
        ? ADDRESS_ZERO
        : underlyingCall.value;

    let pool = Pool.load(event.address)
    if (!pool) {
        pool = new Pool(event.address)
        pool.name = lToken.name()
        pool.symbol = symbol
        pool.underlying = underlying
        pool.decimals = fetchTokenDecimals(underlying)
    } else {
        pool.symbol = symbol
        pool.underlying = underlying
        pool.decimals = fetchTokenDecimals(underlying)
        pool.save()
    }
    pool.balance = lToken.getCash();
    pool.totalSupplied = lToken.totalSupply();
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

    const lToken = ShoebillSbToken.bind(event.address)
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



