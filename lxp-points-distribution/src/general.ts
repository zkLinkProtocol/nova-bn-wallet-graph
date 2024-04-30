import { Address, BigInt, Bytes } from "@graphprotocol/graph-ts"
import { UserPosition, Balance } from "../generated/schema"


// using for erc20 transfer event
export function updateUserBalance(user: Address, updatedToken: Bytes, balance: BigInt): UserPosition {
    let userPosition = UserPosition.load(user)
    if (!userPosition) {
        userPosition = new UserPosition(user)
        userPosition.validate = true
    }
    userPosition.save()

    let tokenBalance = Balance.load(updatedToken)
    if (!tokenBalance) {
        tokenBalance = new Balance(updatedToken)
    }
    tokenBalance.balance = balance
    tokenBalance.userBalance = user
    tokenBalance.save()

    return userPosition
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

