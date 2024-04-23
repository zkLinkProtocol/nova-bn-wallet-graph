import { BigInt, Bytes } from "@graphprotocol/graph-ts";
import { PoolTokenPosition, TokenPosition, UserPosition } from "../generated/schema";
import { fetchTokenBalanceAmount } from "./utils/tokenHelper";

function genOrUpdateUserPosition(account: Bytes): void {
    let userPosition = UserPosition.load(account)
    if (!userPosition) {
        userPosition = new UserPosition(account)
    }

    userPosition.save()
}

function genOrUpdateTokenPosition(account: Bytes, token: Bytes): void {
    genOrUpdateUserPosition(account)
    let tokenPosition = TokenPosition.load(account.concat(token))
    if (!tokenPosition) {
        tokenPosition = new TokenPosition(account.concat(token))
    }
    tokenPosition.token = token
    tokenPosition.balance = fetchTokenBalanceAmount(token.toHexString(), account.toHexString())
    tokenPosition.userPosition = account
    tokenPosition.save()
}

export function genOrUpdatePoolTokenPosition(account: Bytes, token: Bytes, pool: Bytes, amount: BigInt, sharedBalance: BigInt): void {
    genOrUpdateTokenPosition(account, token)

    let poolTokenPosition = PoolTokenPosition.load(account.concat(token).concat(pool))
    if (!poolTokenPosition) {
        poolTokenPosition = new PoolTokenPosition(account.concat(token).concat(pool))
    }
    poolTokenPosition.token = token
    poolTokenPosition.pool = pool
    poolTokenPosition.amount = amount
    poolTokenPosition.sharedBalance = sharedBalance
    poolTokenPosition.tokenPosition = account.concat(token)
    poolTokenPosition.save()
}