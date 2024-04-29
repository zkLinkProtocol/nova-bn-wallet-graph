import { WithdrawalInitiated } from '../../generated/ethereum-bridge/L2ERC20Bridge'
import { Withdrawn } from '../../generated/schema'

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