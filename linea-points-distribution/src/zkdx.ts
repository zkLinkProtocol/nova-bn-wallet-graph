import { Bytes } from '@graphprotocol/graph-ts'
import { Stake, Withdraw, ZkdxStakingETH } from '../generated/Zkdx/ZkdxStakingETH'
import { Position, UserPosition } from '../generated/schema'

const ETH_ADDRESS = Bytes.fromHexString('0x0000000000000000000000000000000000000000')


export function handleStake(event: Stake): void {
    let userPosition = UserPosition.load(event.params.account)
    if (!userPosition) {
        userPosition = new UserPosition(
            event.transaction.from
        )
    }
    userPosition.blockNumber = event.block.number
    userPosition.blockTimestamp = event.block.timestamp
    userPosition.transactionHash = event.transaction.hash
    userPosition.save()

    const contract = ZkdxStakingETH.bind(event.address)
    const balance = contract.balanceOf(event.params.account)

    const positionId = event.transaction.from.concat(ETH_ADDRESS).concat(event.address)
    let position = Position.load(positionId)
    if (!position) {
        position = new Position(positionId)
    }
    position.amount = balance
    position.shareBalance = balance
    position.pool = event.address
    position.token = ETH_ADDRESS
    position.user = event.params.account
    position.save()
}

export function handleWithdraw(event: Withdraw): void {
    let userPosition = UserPosition.load(event.params.account)
    if (!userPosition) {
        userPosition = new UserPosition(
            event.transaction.from
        )
    }
    userPosition.blockNumber = event.block.number
    userPosition.blockTimestamp = event.block.timestamp
    userPosition.transactionHash = event.transaction.hash
    userPosition.save()

    const contract = ZkdxStakingETH.bind(event.address)
    const balance = contract.balanceOf(event.params.account)

    const positionId = event.transaction.from.concat(ETH_ADDRESS).concat(event.address)
    let position = Position.load(positionId)
    if (!position) {
        position = new Position(positionId)
    }
    position.amount = balance
    position.shareBalance = balance
    position.pool = event.address
    position.token = ETH_ADDRESS
    position.user = event.params.account
    position.save()
}