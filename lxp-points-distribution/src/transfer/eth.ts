
import { Address, BigInt, log } from '@graphprotocol/graph-ts'
import { Transfer, Mint } from '../../generated/L2EthToken/L2EthTokenABI'
import { updateUserBalance } from '../general'
import { SPECIAL_ADDRESS } from '../constants'
import { Balance } from '../../generated/schema'


export function handleL2EthTransfer(event: Transfer): void {
    const from = event.params.from
    const to = event.params.to
    if (from.equals(to)) {
        return
    }
    const toTokenBalance = Balance.load(to.concat(Address.fromHexString('0x0000000000000000000000000000000000000000')))
    const newToTokenBalance = toTokenBalance ? toTokenBalance.balance.plus(event.params.value) : event.params.value
    if (!SPECIAL_ADDRESS.includes(to)) {
        log.info('handleL2EthTransfer: {}, {}', [to.toHexString(), event.block.number.toString()])
        updateUserBalance(to, Address.fromHexString('0x0000000000000000000000000000000000000000'), newToTokenBalance)
    }

    const fromTokenBalance = Balance.load(from.concat(Address.fromHexString('0x0000000000000000000000000000000000000000')))
    const newFromTokenBalance = fromTokenBalance ? fromTokenBalance.balance.minus(event.params.value) : BigInt.zero()
    if (!SPECIAL_ADDRESS.includes(from)) {
        log.info('handleL2EthTransfer: {}, {}', [from.toHexString(), event.block.number.toString()])
        updateUserBalance(from, Address.fromHexString('0x0000000000000000000000000000000000000000'), newFromTokenBalance)
    }

}

export function handleL2EthMint(event: Mint): void {
    let tokenBalance = Balance.load(event.params.account.concat(Address.fromHexString('0x0000000000000000000000000000000000000000')))

    const newBalance = tokenBalance ? tokenBalance.balance.plus(event.params.amount) : event.params.amount
    if (!SPECIAL_ADDRESS.includes(event.params.account)) {
        log.info('handleL2EthMint: {}, {}', [event.params.account.toHexString(), event.block.number.toString()])
        updateUserBalance(event.params.account, Address.fromHexString('0x0000000000000000000000000000000000000000'), newBalance)
    }
}