import { ERC20 } from '../generated/Aqua/ERC20'
import { Transfer } from '../generated/pufferEth/ERC20'
import { ADDRESS_ZERO } from './constants'
import { updateUserBalance } from './general'

export function handleTransfer(event: Transfer): void {
    const contract = ERC20.bind(event.address)
    if (event.params.from.notEqual(ADDRESS_ZERO)) {
        updateUserBalance(event.params.from, contract.balanceOf(event.params.from))
    }
    if (event.params.to.notEqual(ADDRESS_ZERO)) {
        updateUserBalance(event.params.to, contract.balanceOf(event.params.to))
    }
}