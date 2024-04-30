
import { Address, ethereum, log } from '@graphprotocol/graph-ts'
import { Transfer, Mint, Withdrawal, WithdrawalWithMessage } from '../../generated/L2EthToken/L2EthTokenABI'
import { updateUserBalance } from '../general'
import { SPECIAL_ADDRESS } from '../constants'


export function handleL2EthTransfer(event: Transfer): void {
    const from = event.params.from
    const to = event.params.to
    const fromBalance = ethereum.getBalance(from)
    const toBalance = ethereum.getBalance(to)
    if (!SPECIAL_ADDRESS.includes(from)) {
        log.info('handleL2EthTransfer: {}, {}', [from.toHexString(), event.block.number.toString()])
        updateUserBalance(from, Address.fromHexString('0x0000000000000000000000000000000000000000'), fromBalance)
    }
    if (!SPECIAL_ADDRESS.includes(to)) {
        log.info('handleL2EthTransfer: {}, {}', [to.toHexString(), event.block.number.toString()])
        updateUserBalance(to, Address.fromHexString('0x0000000000000000000000000000000000000000'), toBalance)
    }
}

export function handleL2EthMint(event: Mint): void {
    const balance = ethereum.getBalance(event.params.account)
    if (!SPECIAL_ADDRESS.includes(event.params.account)) {
        log.info('handleL2EthMint: {}, {}', [event.params.account.toHexString(), event.block.number.toString()])
        updateUserBalance(event.params.account, Address.fromHexString('0x0000000000000000000000000000000000000000'), balance)
    }
}

export function handleL2EthWithdrawal(event: Withdrawal): void {
    const balance = ethereum.getBalance(event.params._l2Sender)
    if (!SPECIAL_ADDRESS.includes(event.params._l2Sender)) {
        log.info('handleL2EthWithdrawal: {}, {}', [event.params._l2Sender.toHexString(), event.block.number.toString()])
        updateUserBalance(event.params._l2Sender, Address.fromHexString('0x0000000000000000000000000000000000000000'), balance)
    }
}

export function handleL2EthWithdrawalWithMessage(event: WithdrawalWithMessage): void {
    const balance = ethereum.getBalance(event.params._l2Sender)
    if (!SPECIAL_ADDRESS.includes(event.params._l2Sender)) {
        log.info('handleL2EthWithdrawalWithMessage: {}, {}', [event.params._l2Sender.toHexString(), event.block.number.toString()])
        updateUserBalance(event.params._l2Sender, Address.fromHexString('0x0000000000000000000000000000000000000000'), balance)
    }
}