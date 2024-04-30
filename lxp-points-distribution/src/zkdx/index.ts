/** viewed */

import { Address, BigInt, Bytes } from '@graphprotocol/graph-ts'
import { Stake, Withdraw, ZkdxStakingETH } from '../../generated/Zkdx/ZkdxStakingETH'
import { Pool, PoolTokenPosition } from '../../generated/schema'
import { setUserInvalid } from '../general'


const ETH_ADDRESS = Bytes.fromHexString('0x0000000000000000000000000000000000000000')


export function handleStake(event: Stake): void {
    setUserInvalid(event.address)
    const zkdxStakingETHContract = ZkdxStakingETH.bind(event.address)

    let pool = Pool.load(event.address)
    if (!pool) {
        pool = new Pool(event.address)
        pool.symbol = "ETH"
        pool.underlying = ETH_ADDRESS
        pool.poolName = 'ZKDX'
        pool.decimals = BigInt.fromI32(18)
        pool.balance = BigInt.zero()
        pool.totalSupplied = BigInt.zero()
    }
    pool.balance = pool.balance.plus(event.params.amount)
    pool.totalSupplied = zkdxStakingETHContract.totalSupply()
    pool.save()
    // update from to
    updateTokenPosition(event.params.account, pool, zkdxStakingETHContract)
}

export function handleWithdraw(event: Withdraw): void {
    setUserInvalid(event.address)
    const zkdxStakingETHContract = ZkdxStakingETH.bind(event.address)

    let pool = Pool.load(event.address)
    if (!pool) {
        pool = new Pool(event.address)
        pool.symbol = "ETH"
        pool.underlying = ETH_ADDRESS
        pool.poolName = 'ZKDX'
        pool.decimals = BigInt.fromI32(18)
        pool.balance = BigInt.zero()
        pool.totalSupplied = BigInt.zero()
        pool.save()
    }
    pool.balance = pool.balance.minus(event.params.amount)
    pool.totalSupplied = zkdxStakingETHContract.totalSupply()
    pool.save()
    // update from to
    updateTokenPosition(event.params.account, pool, zkdxStakingETHContract)

}

function updateTokenPosition(user: Address, pool: Pool, zkdxStakingETHContract: ZkdxStakingETH,): void {
    const poolTokenPositionId = user.concat(pool.underlying).concat(pool.id)
    let poolTokenPosition = PoolTokenPosition.load(poolTokenPositionId)
    if (!poolTokenPosition) {
        poolTokenPosition = new PoolTokenPosition(poolTokenPositionId)
    }
    poolTokenPosition.token = pool.underlying
    poolTokenPosition.pool = pool.id
    poolTokenPosition.supplied = zkdxStakingETHContract.balanceOf(user)
    poolTokenPosition.userPosition = user
    poolTokenPosition.save()
}