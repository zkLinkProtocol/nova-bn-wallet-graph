import { Address } from "@graphprotocol/graph-ts"
import { UserPosition } from "../generated/schema"


// using for erc20 transfer event
export function createUserBalance(user: Address): UserPosition {
    let userPosition = UserPosition.load(user)
    if (!userPosition) {
        userPosition = new UserPosition(user)
        userPosition.valid = true
        userPosition.save()
    }
    return userPosition
}

// using for setting contract address invalid
export function setUserInvalid(user: Address): UserPosition {
    let userPosition = UserPosition.load(user)
    if (!userPosition) {
        userPosition = new UserPosition(user)
    }
    userPosition.valid = false
    userPosition.save()

    return userPosition
}

