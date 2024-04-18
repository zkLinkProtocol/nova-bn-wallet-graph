# layerbank (done)

### condition
Any amount 

### issue
**no data issue**

## supply
- https://explorer.zklink.io/tx/0x04f4d3b368781eb14a7ac08cebe5822ffdb6406365c799a1eff67073a33b7e38#eventlog /
- https://explorer.zklink.io/tx/0xfc42460a1700a24fc6fd2acb6b798783d81a219b8a0cf97a9b854c801ea181be#eventlog)
```
<!-- 0x4Ac518DbF0CC730A1c880739CFa98fe0bB284959
MarketSupply(index_topic_1 address user, index_topic_2 address lToken, data uint256 uAmount) -->

0xb666582F612692525C4027d2a8280Ac06a055a95
Mint(index_topic_1 address minter, data uint256 mintAmount)

```

## borrow (https://explorer.zklink.io/tx/0x2bd678ffdf9eadc2f4ffb24102675abe75b735319c7a367101ec9220b2668be0#eventlog)
```Borrow (index_topic_1 address account, index_topic_2 uint256 ammount, data uint256 accountBorrow)```


# zkdx
stake

abi ```event Stake(address indexed account, uint256 amount);```

Staking for USDC
0x9292EbD38Ac73EA880199d7ffE0219Eee3Fd49C5  
https://explorer.zklink.io/tx/0x80050e6e34dc142ef1496c054e5dd082fd1e59178119e7606d365661bdf536a2#eventlog
https://github.com/zkDX-DeFi/Smart_Contracts/blob/master/deployments/zksync_mainnet/ZkdxStakingUSDC.json

Staking for ETH
0xb5e635f2cB9eAC385D679069f8e0d1740436b355
https://github.com/zkDX-DeFi/Smart_Contracts/blob/master/contracts/staking/ZkdxStakingETH.sol


# izumi (done)

### condition
5 USDT (todo)

### issue
**not check yet**

```
Swap(address,address,uint24,bool,uint256,uint256,int24)
```
https://explorer.zklink.io/tx/0x71032a8d61d687fa665bd04ca5786f474d5242b4378b9b5b501b51a3949824c3 USDT(arb)
https://explorer.zklink.io/tx/0x8db22e71d1bc51f49b2252bc61e748f27d2b767dc48052fcd3841da3d3faf8a4 USDC(arb)
https://explorer.zklink.io/tx/0x0cf11bc7ee6e71df9c14d429bb35550f4a8dd8e81b999341ec583413175b9c1b USDT.arbi-USDT
https://explorer.zklink.io/tx/0xdc9f363ae05309d4198389f9d4ce71d0be13f966158bd5b550998597f11f84e2#overview USDC-ETH 0x5457C04370C447aeD563489D9Fe0b1D057439E0b
https://explorer.zklink.io/tx/0xaa05bb18379b00f1c2dc1a2e7dddd2b1fe25d624f2bd636d1b33780bf5a3b677 USDT 0x5457C04370C447aeD563489D9Fe0b1D057439E0b

0x062C027E4736F90BB06bA4bfc8036F133fd99413 USDT-ETH

- 1  USDC-WETH       0x5457C04370C447aeD563489D9Fe0b1D057439E0b 419777
- 2  USDC.arb-WETH   0xD4b701A553005464292e978eFd8ABC48252a7722 6706
- 3  USDT-USDC       0x19142b9D0077eb776d04a4b42a526dd07409B9Db 478005
- 4  USDT.arb-WETH   0xc2909FeB6f46e19F2b40f9288Ac63726D7C2612c 392843
<!-- - 5  USDT.eth-WETH   0xe3905d48be8aedb1be57c8ad924c40de7e4fb4ff ❌ -->
- 6  USDT-ETH        0x062c027e4736f90bb06ba4bfc8036f133fd99413 487248
<!-- - 7  ETH/USDC.Linea  0x28592307d115f883acc87763803c3679c0d42fb1 ❌ -->
<!-- - 9  USDT/ETH        0xE8a8f1D76625B03b787F6ED17bD746e0515F3aEf ❌ -->
- 10 USDC.Eth/ETH    0x55A367Cf8ba4CE47e48e41179de98C549F17a8E5 128876



--------------------------------------------------------------------------------------------------------------------------


# linkswap
0x381D380B9f2398B8905E1d5EaB6C62309623898B， Name: WETH-USDC(ARB)
0x60f9A429356a9CCc8f1F922c020A6178C95238fd， Name: WETH-USDT(ARB)
0xf5Fec5df952F6108288aEb463799825d4A8E8b51， Name: WETH-USDC(ETH)
0x4c37D751a3bA4d26cf8edBFb0087E15b95E4675b， Name: WETH-USDT(ETH)
0x16F9368A101495263E3737EfD5a8F56D061B80Cb， Name: WETH-USDC(ARB1)
0x8e5aa41a021495b606F9181B508759a39Ac2c3e4， Name: WETH-USDT(MERGE)
0x4eaDd78a23E152FeC2b63F0f5A3423bDa2207E9b， Name: WETH-USDC(MERGE)

```solidity

 Swap(indexed address,uint256,uint256,uint256,uint256,indexed address)

```

# nativeX

## swap

```Typescript
// support token
const ARB_ARB = Address.fromString('0xcb70533c9635060275F1A97539dda2E3f8bFac42')
const MANTA = Address.fromString('0xF5d3953a33F78E0412A8988FD77B4920AA968B0b')
const STONE_MANTA = Address.fromString('0xDeEC33dc735Baf36b473598C33BCD077A0f32049')
const WSTETH_ETH = Address.fromString('0xfe8C940B936E3520e314574418585687c3BbAA12')
const USDT_ARB = Address.fromString('0x012726F9f458a63f86055b24E67BA0aa26505028')
```

```solidity
// ABI fn fragment
 RfqTrade(address,address,address,uint256,uint256,bytes16,address)
```

https://explorer.zklink.io/tx/0x5c3a5ac1247eb00cf1d5378746b44750ea79312745f0778fa454ad3cbdf5ea9d#eventlog  mint匹配不上

## supply


**do not support**

WETH 0x9e5CabD99Dfb4e4a0C3Ea6Fe9c3E1A4ce4f5Fce5
ARB.ARB  0x78136b2FbffdF2DF6261990Eec49dbd76Ca63C8F
ARB.ETH  0xf20329d5545bb3273e116a13Ce18b9B2c813cd33
MANTA.MANTA  0x069FDE3A1439d39ba2eEf51559ba7006003A4853
rsETH.ETH    0xae8AF9bdFE0099f6d0A5234009b78642EfAC1b00
WBTC.ETH  0xc1aBa3D8F0b196bC805BfA57c4CDC64BEaC47397
USDT.ARB  0x7fe7bEAA52a75C85B24Fab8D93FE826045B03050
wUSDM.MANTA  0x1274C609d81959DA5014288e9Ff8D22B6A781452
WBTC.ARB  0x2a6D1ad51c18D95C29cfEcc06B82ba6bD32D7B9D
USDT.ETH  0x4d494CC8E010594FdEd57A3D568C98f2C4c80C75
USDT.MERGE 0x0f6Fc293AB973962f9172489f492514Bc43fbA81
WBTC.MERGE 0x97a96711ba21a10BcC5fa75809c2Acbb9dd0a1D4

**support** 

~~ pufETH.ETH  0xc2be3CC06Ab964f9E22e492414399DC4A58f96D3 ~~
~~ STONE.ETH  0x11ac330ef325Be47A9a95B5d5D1357690A7c55F0 ~~
~~ STONE.MANTA  0xa5B104E55d42f41cA1dbbb3ee95C62092c04b8f4 ~~
~~ USDC.ARB  0xf2E73ea408FFb1AE1e6371d068b6e597e468bDeC ~~
~~ USDC.ETH  0x134E199c494859D456885aD4Df2198c45295267d ~~
~~ USDC.e.ARB  0xB48FdeD1FC20D89cac779fC61F159c9B43B06D17 ~~
~~ USDC.MERGE 0x603871A4DDEA08B9375ff6339E319AE7932b640b ~~
~~ wstETH.ETH   0x26c506C3D071bb5aDc16a6623c3fC8B508EaDAa0~~
~~ wstETH.LINEA  0x0d3e7e8d54E686d323a190eAac163CF9AAb6d7fd ~~
wstETH.ARB  0x646fC8D54419742D5b530b92DF77A9e8d6c34D3C

https://explorer.zklink.io/tx/0x907bb9509ed1833823c221f1e09129b9e01563ed3585939b25ace12424fe7194#eventlog USDC











