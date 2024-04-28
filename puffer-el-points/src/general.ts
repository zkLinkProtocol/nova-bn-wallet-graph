import { Address, BigInt } from "@graphprotocol/graph-ts"
import { UserPosition } from "../generated/schema"

export function getUserPosition(user: Address): UserPosition {
    let userPosition = UserPosition.load(user)
    if (!userPosition) {
        userPosition = new UserPosition(user)
        userPosition.save()
    }

    return userPosition
}