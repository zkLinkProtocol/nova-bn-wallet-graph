import { ethereum } from "@graphprotocol/graph-ts";
import { Block } from "../generated/schema";

export function handleBlock(block: ethereum.Block): void {
    let blockEntity = new Block(block.hash);
    blockEntity.number = block.number;
    blockEntity.timestamp = block.timestamp;
    blockEntity.save();
}
