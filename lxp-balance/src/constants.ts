import { BigInt, BigDecimal, Address } from '@graphprotocol/graph-ts'

export const ADDRESS_ZERO = Address.fromString('0x0000000000000000000000000000000000000000');

export const ZERO_BI = BigInt.fromI32(0);
export const ONE_BI = BigInt.fromI32(1);
export const ZERO_BD = BigDecimal.fromString('0');
export const ONE_BD = BigDecimal.fromString('1');

export const SPECIAL_ADDRESS = [
    ADDRESS_ZERO,
    Address.fromString('0x000000000000000000000000000000000000dead'),
    Address.fromString('0x0000000000000000000000000000000000008001'),
    Address.fromString('0x000000000000000000000000000000000000800a'),
    Address.fromString('0x0000000000000000000000000000000000008006'),
    Address.fromString('0xEDeE7052eC016A507E65D6BbffCa535076B227DE'), // fee receiver address
]
