import { Address } from "@graphprotocol/graph-ts"
import { UserPosition } from "../generated/schema"

export function updateUserBalance(user: Address): UserPosition {
    let userPosition = UserPosition.load(user)
    if (!userPosition) {
        userPosition = new UserPosition(user)
        userPosition.validate = true
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
    userPosition.validate = false
    userPosition.save()

    return userPosition
}

