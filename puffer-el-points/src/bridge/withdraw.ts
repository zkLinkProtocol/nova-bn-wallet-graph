import { getUserPosition } from '../general'
import { WithdrawalInitiated } from '../../generated/ethereum-bridge/L2ERC20Bridge'
import { Address } from '@graphprotocol/graph-ts'
import { Withdrawn } from '../../generated/schema'

const pufL12THAddress = Address.fromString('0x1B49eCf1A8323Db4abf48b2F5EFaA33F7DdAB3FC')
export function handleWithdrawalInitiated(event: WithdrawalInitiated): void {
    const id = event.transaction.hash
    const withdrawn = new Withdrawn(id)
    withdrawn.balance = event.params.amount
    withdrawn.blockNumber = event.block.number
    withdrawn.blockTimestamp = event.block.timestamp
    withdrawn.token = event.params.l2Token
    withdrawn.userPosition = event.params.l2Sender
    withdrawn.save()
}