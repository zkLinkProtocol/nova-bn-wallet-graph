import { log, Address, BigInt } from '@graphprotocol/graph-ts';
import { PairCreated } from '../generated/linkswapFactory/linkswapFactory';
import { Burn, Mint } from '../generated/templates/LinkSwap/SwapPair'
import { Pool, PoolTokenPosition, Token } from '../generated/schema';
import { ADDRESS_ZERO } from './constants';
import { fetchTokenBalanceAmount, fetchTokenDecimals, fetchTokenName, fetchTokenSymbol } from './utils/tokenHelper';
import { LinkSwap as LinkSwapTemplate } from '../generated/templates'
import { genOrUpdatePoolTokenPosition } from './general';


export function handlePairCreated(event: PairCreated): void {
    const pool = new Pool(event.params.pair)

    const tokenX = getOrCreateTokenEntity(event.params.token0);
    if (tokenX === null) return;

    const tokenY = getOrCreateTokenEntity(event.params.token1);
    if (tokenY === null) return;

    pool.blockTimestamp = event.block.timestamp;
    pool.amountX = BigInt.zero();
    pool.amountY = BigInt.zero();
    pool.blockNumber = event.block.number;
    pool.transactionHash = event.transaction.hash;
    pool.tokenX = tokenX.id;
    pool.tokenY = tokenY.id;

    LinkSwapTemplate.create(event.params.pair)
    pool.save();
}

function getOrCreateTokenEntity(tokenAddress: Address): Token | null {
    let token = Token.load(tokenAddress);

    if (token === null) {
        token = new Token(tokenAddress);

        const tokenSymbol = fetchTokenSymbol(tokenAddress);
        if (tokenSymbol == ADDRESS_ZERO) return null
        token.symbol = tokenSymbol

        const tokenName = fetchTokenName(tokenAddress);
        if (tokenName == '') return null
        token.name = tokenName;


        const decimals = fetchTokenDecimals(tokenAddress);

        // bail if we couldn't figure out the decimals
        if (decimals === null) {
            log.debug('may bug the decimal on token was null', []);
            return null;
        }
        token.decimals = decimals;


    }

    token.save()

    return token;
}

export function handleMint(event: Mint): void {

    let poolEntity = Pool.load(event.address)
    if (!poolEntity) return
    poolEntity.amountX = poolEntity.amountX.plus(event.params.amount0)
    poolEntity.amountY = poolEntity.amountY.plus(event.params.amount1)
    poolEntity.blockNumber = event.block.number
    poolEntity.blockTimestamp = event.block.timestamp
    poolEntity.transactionHash = event.transaction.hash
    poolEntity.save()

    const poolTokenXBalance = fetchTokenBalanceAmount(poolEntity.tokenX.toHexString(), poolEntity.id.toHexString())
    const poolTokenYBalance = fetchTokenBalanceAmount(poolEntity.tokenY.toHexString(), poolEntity.id.toHexString())

    // update tokenX
    const positionXId = event.transaction.from.concat(poolEntity.tokenX).concat(event.address)
    let amountX = BigInt.zero()
    let positionX = PoolTokenPosition.load(positionXId)
    if (!positionX) {
        positionX = new PoolTokenPosition(positionXId)
        amountX = event.params.amount0

    } else {
        amountX = positionX.amount.plus(event.params.amount0)
    }
    const sharedBalanceX = amountX.times(poolTokenXBalance).div(poolEntity.amountX)
    genOrUpdatePoolTokenPosition(event.transaction.from, poolEntity.tokenX, event.address, sharedBalanceX, amountX)

    // // update tokenY
    const positionYId = event.transaction.from.concat(poolEntity.tokenY).concat(event.address)
    let amountY = BigInt.zero()
    let positionY = PoolTokenPosition.load(positionYId)
    if (!positionY) {
        positionY = new PoolTokenPosition(positionYId)
        amountY = event.params.amount1
    } else {
        amountY = positionY.amount.plus(event.params.amount1)
    }
    const sharedBalanceY = amountY.times(poolTokenYBalance).div(poolEntity.amountY)
    genOrUpdatePoolTokenPosition(event.transaction.from, poolEntity.tokenY, event.address, sharedBalanceY, amountY)
}

export function handleBurn(event: Burn): void {
    let poolEntity = Pool.load(event.address)
    if (!poolEntity) return
    poolEntity.amountX = poolEntity.amountX.minus(event.params.amount0)
    poolEntity.amountY = poolEntity.amountY.minus(event.params.amount1)
    poolEntity.blockNumber = event.block.number
    poolEntity.blockTimestamp = event.block.timestamp
    poolEntity.transactionHash = event.transaction.hash
    poolEntity.save()

    const poolTokenXBalance = fetchTokenBalanceAmount(poolEntity.tokenX.toHexString(), poolEntity.id.toHexString())
    const poolTokenYBalance = fetchTokenBalanceAmount(poolEntity.tokenY.toHexString(), poolEntity.id.toHexString())

    // update tokenX
    const positionXId = event.transaction.from.concat(poolEntity.tokenX).concat(event.address)
    let amountX = BigInt.zero()

    let positionX = PoolTokenPosition.load(positionXId)
    if (!positionX) {
        positionX = new PoolTokenPosition(positionXId)
        amountX = event.params.amount0

    } else {
        amountX = positionX.amount.minus(event.params.amount0)
    }
    const sharedBalanceX = amountX.times(poolTokenXBalance).div(poolEntity.amountX)
    genOrUpdatePoolTokenPosition(event.transaction.from, poolEntity.tokenX, event.address, sharedBalanceX, amountX)


    // // update tokenY
    const positionYId = event.transaction.from.concat(poolEntity.tokenY).concat(event.address)
    let amountY = BigInt.zero()
    let positionY = PoolTokenPosition.load(positionYId)
    if (!positionY) {
        positionY = new PoolTokenPosition(positionYId)
        amountY = event.params.amount1
    } else {
        amountY = positionY.amount.minus(event.params.amount1)
    }
    const sharedBalanceY = amountY.times(poolTokenYBalance).div(poolEntity.amountY)
    genOrUpdatePoolTokenPosition(event.transaction.from, poolEntity.tokenY, event.address, sharedBalanceY, amountY)
}
