import { Address, BigInt, log } from '@graphprotocol/graph-ts'
import { Transfer } from '../../generated/rsETH_eth/ERC20'
import { Balance, UserPosition } from '../../generated/schema'
import { SPECIAL_ADDRESS } from '../constants'
import { fetchTokenDecimals, fetchTokenSymbol } from '../utils/tokenHelper'

function updateUserBalance(user: Address, updatedToken: Address, balance: BigInt): void {
    let userPosition = UserPosition.load(user)
    if (!userPosition) {
        userPosition = new UserPosition(user)
        userPosition.valid = true
        userPosition.save()
    }

    let tokenBalance = Balance.load(user.concat(updatedToken))
    if (!tokenBalance) {
        tokenBalance = new Balance(user.concat(updatedToken))
        tokenBalance.decimals = fetchTokenDecimals(Address.fromBytes(updatedToken))
        tokenBalance.symbol = fetchTokenSymbol(Address.fromBytes(updatedToken))
        tokenBalance.tokenAddress = updatedToken
        tokenBalance.userAddress = user
        tokenBalance.userPosition = user
    }
    tokenBalance.balance = balance
    tokenBalance.save()
    log.info('updateUserBalance: {}, {}, {}', [user.toHexString(), updatedToken.toHexString(), balance.toString()])
}

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


