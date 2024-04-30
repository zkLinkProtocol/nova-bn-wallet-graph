import { Address, BigInt, Bytes, log } from "@graphprotocol/graph-ts"
import { UserPosition, Balance } from "../generated/schema"


// using for erc20 transfer event
export function updateUserBalance(user: Address, updatedToken: Bytes, balance: BigInt): void {
    let userPosition = UserPosition.load(user)
    if (!userPosition) {
        userPosition = new UserPosition(user)
        userPosition.validate = true
    }
    userPosition.save()

    let tokenBalance = Balance.load(user.concat(updatedToken))
    if (!tokenBalance) {
        tokenBalance = new Balance(user.concat(updatedToken))
    }
    tokenBalance.balance = balance
    tokenBalance.userBalance = userPosition.id
    tokenBalance.save()
    log.info('updateUserBalance: {}, {}, {}', [user.toHexString(), updatedToken.toHexString(), balance.toString()])
}

// using for setting contract address invalid
export function setUserInvalid(user: Address): UserPosition {
    let userPosition = UserPosition.load(user)
    if (!userPosition) {
        userPosition = new UserPosition(user)
    }
    userPosition.validate = false
    userPosition.save()

    return userPosition
}

