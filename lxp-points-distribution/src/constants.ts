import { BigInt, BigDecimal, Address } from '@graphprotocol/graph-ts'

export const ADDRESS_ZERO = '0x0000000000000000000000000000000000000000';

export const ZERO_BI = BigInt.fromI32(0);
export const ONE_BI = BigInt.fromI32(1);
export const ZERO_BD = BigDecimal.fromString('0');
export const ONE_BD = BigDecimal.fromString('1');

export const SPECIAL_ADDRESS = [
    Address.fromString('0x0000000000000000000000000000000000000000'),
    Address.fromString('0x000000000000000000000000000000000000dead'),
    Address.fromString('0x0000000000000000000000000000000000008001'),
    Address.fromString('0x000000000000000000000000000000000000800a'),
    Address.fromString('0x0000000000000000000000000000000000008006')
]
