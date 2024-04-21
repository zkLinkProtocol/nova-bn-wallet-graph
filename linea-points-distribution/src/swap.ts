import { Swap } from '../generated/templates/Pool/SwapPoolAbi'
import { Pool } from '../generated/schema'

export function handleSwap(event: Swap): void {
    const pool = Pool.load(event.address)
    if(!pool) return

    if(event.params.sellXEarnY) {
        pool.amountX = pool.amountX.plus(event.params.amountX)
        pool.amountY = pool.amountY.minus(event.params.amountY)
    } else {
        pool.amountX = pool.amountX.minus(event.params.amountX)
        pool.amountY = pool.amountY.plus(event.params.amountY)
    }
    pool.blockNumber = event.block.number
    pool.blockTimestamp = event.block.timestamp
    pool.transactionHash = event.transaction.hash
    pool.save()
}
