import { ERC20, Transfer } from '../../generated/WETH/ERC20'
import { SPECIAL_ADDRESS } from '../constants'
import { updateUserBalance } from '../general'

export function handleERC20Transfer(event: Transfer): void {
    const erc20Contract = ERC20.bind(event.address)
    const fromBalance = erc20Contract.balanceOf(event.params.from)
    const toBalance = erc20Contract.balanceOf(event.params.to)
    if (!SPECIAL_ADDRESS.includes(event.params.from)) {
        updateUserBalance(event.params.from, event.address, fromBalance)
    }
    if (!SPECIAL_ADDRESS.includes(event.params.to)) {
        updateUserBalance(event.params.to, event.address, toBalance)
    }
}