/** viewed */

import { Bytes } from '@graphprotocol/graph-ts'
import { Stake, Withdraw, ZkdxStakingETH } from '../generated/Zkdx/ZkdxStakingETH'
import { genOrUpdatePoolTokenPosition } from './general'

const ETH_ADDRESS = Bytes.fromHexString('0x0000000000000000000000000000000000000000')


export function handleStake(event: Stake): void {

    const contract = ZkdxStakingETH.bind(event.address)
    const balance = contract.balanceOf(event.params.account)

    genOrUpdatePoolTokenPosition(event.params.account, ETH_ADDRESS, event.address, balance, balance)
}

export function handleWithdraw(event: Withdraw): void {

    const contract = ZkdxStakingETH.bind(event.address)
    const balance = contract.balanceOf(event.params.account)

    genOrUpdatePoolTokenPosition(event.params.account, ETH_ADDRESS, event.address, balance, balance)
}