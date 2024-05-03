import { BigInt } from '@graphprotocol/graph-ts'
import { Balance } from '../../generated/schema'
import { Transfer } from '../../generated/WETH/ERC20'
import { SPECIAL_ADDRESS } from '../constants'
import { updateUserBalance } from '../general'

export function handleERC20Transfer(event: Transfer): void {
    const toTokenBalance = Balance.load(event.params.to.concat(event.address))
    const newToBalance = toTokenBalance ? toTokenBalance.balance.plus(event.params.value) : event.params.value
    if (!SPECIAL_ADDRESS.includes(event.params.to)) {
        updateUserBalance(event.params.to, event.address, newToBalance)
    }

    const fromTokenBalance = Balance.load(event.params.from.concat(event.address))
    const newFromBalance = fromTokenBalance ? fromTokenBalance.balance.minus(event.params.value) : BigInt.zero()
    if (!SPECIAL_ADDRESS.includes(event.params.from)) {
        updateUserBalance(event.params.from, event.address, newFromBalance)
    }
}