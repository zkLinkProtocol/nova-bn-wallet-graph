import { BigInt, BigDecimal, Address } from '@graphprotocol/graph-ts'

export const ADDRESS_ZERO = '0x0000000000000000000000000000000000000000';
export const L1_ETH = Address.fromString('0x0000000000000000000000000000000000000000')
export const L2_ETH = Address.fromString('0x000000000000000000000000000000000000800A')
export const pufETHAddress = Address.fromString('0x1B49eCf1A8323Db4abf48b2F5EFaA33F7DdAB3FC')

export const ZERO_BI = BigInt.fromI32(0);
export const ONE_BI = BigInt.fromI32(1);
export const ZERO_BD = BigDecimal.fromString('0');
export const ONE_BD = BigDecimal.fromString('1');
export const TWO_BD = BigDecimal.fromString('2');
export const HUNDRED_BD = BigDecimal.fromString('100');
export const BI_18 = BigInt.fromI32(18);

export const DAY_SECONDS = 86400;
export const HOUR_SECONDS = 3600;

export const GLOBAL_ADDRESS = 'GLOBAL_ADDRESS';
export const GLOBAL_POOL = 'GLOBAL_POOL';
export const GLOBAL_TOKEN = 'GLOBAL_TOKEN';
export const SPECIAL_ADDRESS = [
    Address.fromString('0x0000000000000000000000000000000000000000'),
    Address.fromString('0x000000000000000000000000000000000000dead')
]
