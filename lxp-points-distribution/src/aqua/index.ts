
import { AquaLpToken, Transfer } from '../../generated/Aqua/AquaLpToken'
import { PoolTokenPosition, Pool } from '../../generated/schema'
import { Address, BigInt } from '@graphprotocol/graph-ts'
import { setUserInvalid } from '../general'
import { fetchTokenSymbol } from './utils/tokenHelper'
import { SPECIAL_ADDRESS } from '../constants'


export function handleTransfer(event: Transfer): void {
    setUserInvalid(event.address)
    let pool = Pool.load(event.address)
    if (!pool) {
        const aquaCToken = AquaLpToken.bind(event.address)
        pool = new Pool(event.address)
        pool.poolName = 'Aqua'
        pool.balance = BigInt.zero()
        pool.totalSupplied = BigInt.zero()
        pool.underlying = aquaCToken.underlying()
        pool.decimals = BigInt.fromI32(aquaCToken.decimals())
        pool.symbol = fetchTokenSymbol(aquaCToken.underlying())
        pool.save()
    }
    // update from to
    if (event.params.from.notEqual(event.address) && !SPECIAL_ADDRESS.includes(event.params.from)) {
        updateTokenPosition(event.params.from, event, pool)
    }

    // update to address
    if (event.params.to.notEqual(event.address) && !SPECIAL_ADDRESS.includes(event.params.to)) {
        updateTokenPosition(event.params.to, event, pool)
    }
}

function updateTokenPosition(user: Address, event: Transfer, pool: Pool): void {

    const aquaCToken = AquaLpToken.bind(Address.fromBytes(pool.id))
    const underlying = aquaCToken.underlying()
    const totalBalance = aquaCToken.getCash()
    setUserInvalid(aquaCToken.aquaVault()) // THE ETH locked in this account


    pool.balance = totalBalance;
    pool.totalSupplied = aquaCToken.totalSupply();
    pool.save()

    const tokenPositionId = user.concat(Address.fromHexString(event.address.toHexString()))
    let poolTokenPosition = PoolTokenPosition.load(tokenPositionId)
    if (!poolTokenPosition) {
        poolTokenPosition = new PoolTokenPosition(user.concat(underlying))
    }
    poolTokenPosition.token = underlying
    poolTokenPosition.pool = pool.id
    poolTokenPosition.supplied = aquaCToken.balanceOf(user)
    poolTokenPosition.userPosition = user
    poolTokenPosition.save()
}



