import { log, Address, BigInt } from '@graphprotocol/graph-ts';
import { PairCreated } from '../generated/linkswapFactory/linkswapFactory';
import { Burn, Mint } from '../generated/templates/LinkSwap/SwapPair'
import { Pool, Position, Token } from '../generated/schema';
import { ADDRESS_ZERO } from './constants';
import { fetchTokenBalanceAmount, fetchTokenDecimals, fetchTokenName, fetchTokenSymbol } from './utils/tokenHelper';
import { LinkSwap as LinkSwapTemplate } from '../generated/templates'


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
    const poolTokenXBalance = fetchTokenBalanceAmount(poolEntity.tokenX.toHexString(), poolEntity.id.toHexString())
    const poolTokenYBalance = fetchTokenBalanceAmount(poolEntity.tokenY.toHexString(), poolEntity.id.toHexString())
    poolEntity.amountX = poolEntity.amountX.plus(event.params.amount0)
    poolEntity.amountY = poolEntity.amountY.plus(event.params.amount1)
    poolEntity.blockNumber = event.block.number
    poolEntity.blockTimestamp = event.block.timestamp
    poolEntity.transactionHash = event.transaction.hash
    poolEntity.save()

    // update tokenX
    const positionXId = event.transaction.from.concat(poolEntity.tokenX).concat(event.address)
    let positionX = Position.load(positionXId)
    if (!positionX) {
        positionX = new Position(positionXId)
        positionX.amount = event.params.amount0
    } else {
        positionX.amount = positionX.amount.plus(event.params.amount0)
    }
    positionX.shareBalance = positionX.amount.times(poolTokenXBalance).div(poolEntity.amountX)
    positionX.pool = event.address
    positionX.token = poolEntity.tokenX
    positionX.user = event.transaction.from
    positionX.save()

    // // update tokenY
    const positionYId = event.transaction.from.concat(poolEntity.tokenY).concat(event.address)
    let positionY = Position.load(positionYId)
    if (!positionY) {
        positionY = new Position(positionYId)
        positionY.amount = event.params.amount1
    } else {
        positionY.amount = positionY.amount.plus(event.params.amount1)
    }
    positionY.shareBalance = positionY.amount.times(poolTokenYBalance).div(poolEntity.amountY)
    positionY.pool = event.address
    positionY.token = poolEntity.tokenY
    positionY.user = event.transaction.from
    positionY.save()
}

export function handleBurn(event: Burn): void {
    let poolEntity = Pool.load(event.address)
    if (!poolEntity) return
    const poolTokenXBalance = fetchTokenBalanceAmount(poolEntity.tokenX.toHexString(), poolEntity.id.toHexString())
    const poolTokenYBalance = fetchTokenBalanceAmount(poolEntity.tokenY.toHexString(), poolEntity.id.toHexString())
    poolEntity.amountX = poolEntity.amountX.minus(event.params.amount0)
    poolEntity.amountY = poolEntity.amountY.minus(event.params.amount1)
    poolEntity.blockNumber = event.block.number
    poolEntity.blockTimestamp = event.block.timestamp
    poolEntity.transactionHash = event.transaction.hash
    poolEntity.save()

    // update tokenX
    const positionXId = event.transaction.from.concat(poolEntity.tokenX).concat(event.address)
    let positionX = Position.load(positionXId)
    if (!positionX) {
        positionX = new Position(positionXId)
        positionX.amount = event.params.amount0
    } else {
        positionX.amount = positionX.amount.minus(event.params.amount0)
    }
    positionX.shareBalance = positionX.amount.times(poolTokenXBalance).div(poolEntity.amountX)
    positionX.pool = event.address
    positionX.token = poolEntity.tokenX
    positionX.user = event.transaction.from
    positionX.save()

    // // update tokenY
    const positionYId = event.transaction.from.concat(poolEntity.tokenY).concat(event.address)
    let positionY = Position.load(positionYId)
    if (!positionY) {
        positionY = new Position(positionYId)
        positionY.amount = event.params.amount1
    } else {
        positionY.amount = positionY.amount.minus(event.params.amount1)
    }
    positionY.shareBalance = positionY.amount.times(poolTokenYBalance).div(poolEntity.amountY)
    positionY.pool = event.address
    positionY.token = poolEntity.tokenY
    positionY.user = event.transaction.from
    positionY.save()

}
