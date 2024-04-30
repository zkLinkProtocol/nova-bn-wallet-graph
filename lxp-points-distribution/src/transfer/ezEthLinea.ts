import { ERC20, Transfer } from '../../generated/ezETH_Linea/ERC20'
import { updateUserBalance } from '../general'

export function handleERC20Transfer(event: Transfer): void {
    const erc20Contract = ERC20.bind(event.address)
    const fromBalance = erc20Contract.balanceOf(event.params.from)
    const toBalance = erc20Contract.balanceOf(event.params.to)

    updateUserBalance(event.params.from, event.address, fromBalance)
    updateUserBalance(event.params.to, event.address, toBalance)
}