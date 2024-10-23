
import { Address, BigInt, log } from '@graphprotocol/graph-ts'
import { Transfer, Mint, L2EthTokenABI } from '../../generated/L2EthToken/L2EthTokenABI'
import { SPECIAL_ADDRESS } from '../constants'
import { Balance, UserPosition } from '../../generated/schema'

export function updateUserETHBalance(user: Address, updatedToken: Address, balance: BigInt): void {
    let userPosition = UserPosition.load(user)
    if (!userPosition) {
        userPosition = new UserPosition(user)
        userPosition.valid = true
        userPosition.save()
    }

    const L2EthContract = L2EthTokenABI.bind(Address.fromBytes(updatedToken))
    let tokenBalance = Balance.load(user.concat(updatedToken))
    if (!tokenBalance) {
        tokenBalance = new Balance(user.concat(updatedToken))
        tokenBalance.tokenAddress = updatedToken
        tokenBalance.userAddress = user
        tokenBalance.decimals = BigInt.fromI32(L2EthContract.try_decimals().value)
        tokenBalance.symbol = L2EthContract.try_symbol().value
        tokenBalance.userPosition = user
    }
    tokenBalance.balance = balance
    tokenBalance.save()
    log.info('updateUserBalance: {}, {}, {}', [user.toHexString(), updatedToken.toHexString(), balance.toString()])
}

export function handleL2EthTransfer(event: Transfer): void {
    const from = event.params.from
    const to = event.params.to
    if (from.equals(to)) {
        return
    }
    const toTokenBalance = Balance.load(to.concat(event.address))
    const newToTokenBalance = toTokenBalance ? toTokenBalance.balance.plus(event.params.value) : event.params.value
    if (!SPECIAL_ADDRESS.includes(to)) {
        log.info('handleL2EthTransfer: {}, {}', [to.toHexString(), event.block.number.toString()])
        updateUserETHBalance(to, event.address, newToTokenBalance)

    }

    const fromTokenBalance = Balance.load(from.concat(event.address))
    const newFromTokenBalance = fromTokenBalance ? fromTokenBalance.balance.minus(event.params.value) : BigInt.zero()
    if (!SPECIAL_ADDRESS.includes(from)) {
        log.info('handleL2EthTransfer: {}, {}', [from.toHexString(), event.block.number.toString()])
        updateUserETHBalance(from, event.address, newFromTokenBalance)
    }

}

export function handleL2EthMint(event: Mint): void {
    let tokenBalance = Balance.load(event.params.account.concat(event.address))

    const newBalance = tokenBalance ? tokenBalance.balance.plus(event.params.amount) : event.params.amount
    if (!SPECIAL_ADDRESS.includes(event.params.account)) {
        log.info('handleL2EthMint: {}, {}', [event.params.account.toHexString(), event.block.number.toString()])
        updateUserETHBalance(event.params.account, event.address, newBalance)
    }
}