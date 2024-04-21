import { ByteArray, Bytes, crypto ,ethereum } from '@graphprotocol/graph-ts'
import { Swap as SwapEvent }from '../generated/LinkSwapUSDC_ARB/LinkSwap'
import { LinkSwapEntity } from '../generated/schema'


export function handleLinkSwap(event: SwapEvent): void {
    
    const id = Bytes.fromByteArray(
      crypto.keccak256(ByteArray.fromHexString(event.transaction.from.toHexString()))
    );
    let swapEntity = LinkSwapEntity.load(id)

    const pair0 = event.params.amount0In.gt(event.params.amount0Out) ? event.params.amount0In : event.params.amount0Out
    const pair1 = event.params.amount1In.gt(event.params.amount1Out) ? event.params.amount1In : event.params.amount1Out
    const USDValue = pair0.gt(pair1) ? pair1 : pair0
    
    if(!swapEntity) {
      const entity = new LinkSwapEntity(id)
      entity.account = event.transaction.from
      entity.amount0In =  event.params.amount0In
      entity.amount0Out = event.params.amount0Out
      entity.amount1In = event.params.amount1In
      entity.amount1Out = event.params.amount1Out
      entity.blockNumber = event.block.number
      entity.blockTimestamp = event.block.timestamp
      entity.transactionHash = event.transaction.hash
      entity.accumulateValue = USDValue
      entity.save()
      return 
    }

    swapEntity.accumulateValue = swapEntity.accumulateValue.plus(USDValue)
    swapEntity.save()

  }
  