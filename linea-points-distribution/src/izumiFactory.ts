import { log, Address, BigInt } from '@graphprotocol/graph-ts';
import {  NewPool } from '../generated/iZiSwapFactory/iZiSwapFactory';
import { Pool, Token } from '../generated/schema';
import { ADDRESS_ZERO } from './constants';
import { fetchTokenDecimals, fetchTokenName, fetchTokenSymbol } from './utils/tokenHelper';
import { Pool as PoolTemplate } from '../generated/templates'


export function handleNewPool(event: NewPool): void {
    const pool = new Pool(event.params.pool)
    
    const tokenX = getOrCreateTokenEntity(event.params.tokenX);
    if (tokenX === null) return;

    const tokenY = getOrCreateTokenEntity(event.params.tokenY);
    if (tokenY === null) return;

    pool.blockTimestamp = event.block.timestamp;
    pool.amountX = BigInt.zero();
    pool.amountY = BigInt.zero();
    pool.blockNumber = event.block.number;
    pool.transactionHash = event.transaction.hash;
    pool.tokenX = tokenX.id;
    pool.tokenY = tokenY.id;

    PoolTemplate.create(event.params.pool)
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
