
import { Address, ethereum } from '@graphprotocol/graph-ts'
import { /* L2EthTokenABI,*/ Transfer } from '../../generated/L2EthToken/L2EthTokenABI'
import { updateUserBalance } from '../general'
// import { bigEndianBytesToBigInt } from '../utils'


export function handleL2EthTransfer(event: Transfer): void {
    const fromBalance = ethereum.getBalance(event.params.from)
    const toBalance = ethereum.getBalance(event.params.to)
    // const contract = L2EthTokenABI.bind(event.address)
    // const fromBalance = contract.balanceOf(bigEndianBytesToBigInt(event.params.from))
    // const toBalance = contract.balanceOf(bigEndianBytesToBigInt(event.params.to))

    updateUserBalance(event.params.from, Address.fromHexString('0x0000000000000000000000000000000000000000'), fromBalance)
    updateUserBalance(event.params.to, Address.fromHexString('0x0000000000000000000000000000000000000000'), toBalance)

}