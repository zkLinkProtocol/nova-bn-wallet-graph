import { Address, BigInt } from "@graphprotocol/graph-ts";
import { ERC20 } from "../generated/ezETH_Linea/ERC20";
import { ERC20BytesMethod } from '../generated/ezETH_Linea/ERC20BytesMethod'
import { ADDRESS_ZERO } from "./constants";

function isNullEthValue(value: string): boolean {
    return value == '0x0000000000000000000000000000000000000000000000000000000000000001';
}

export function fetchTokenDecimals(tokenAddress: Address): BigInt {
    let contract = ERC20.bind(tokenAddress);
    const decimalResult = contract.try_decimals();
    if (!decimalResult.reverted) {
        return BigInt.fromI32(decimalResult.value);
    }
    return BigInt.fromString('18');
}

export function fetchTokenSymbol(tokenAddress: Address): string {
    const contract = ERC20.bind(tokenAddress);

    // try types string and bytes32 for symbol
    let symbolValue = 'unknown';
    const symbolResult = contract.try_symbol();
    if (symbolResult.reverted) {
        const contractSymbolBytes = ERC20BytesMethod.bind(tokenAddress);
        const symbolResultBytes = contractSymbolBytes.try_symbol();
        if (!symbolResultBytes.reverted) {
            if (!isNullEthValue(symbolResultBytes.value.toHexString())) {
                symbolValue = symbolResultBytes.value.toString();
            }
        } else {
            return ADDRESS_ZERO.toHexString()
        }
    } else {
        symbolValue = symbolResult.value;
    }

    return symbolValue;
}