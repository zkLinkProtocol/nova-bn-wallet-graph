# Linea Network points

# Overview

This repository aims to provide balance shares for EOA accounts for credit scoring on the Linea network.To tally the transfer records of ERC20 tokens for accounting balances, and to allocate LP (liquidity provider) balance points proportionately based on user shares in different LPs on the Nova network.

## ETH/WETH address

- ETH 0x000000000000000000000000000000000000800A
- WETH 0x8280a4e7D5B3B658ec4580d3Bc30f5e50454F169

## LP Share

> The following projects have LP (liquidity provider) contracts that require handling

## Project - izumi

0x33D9936b7B7BC155493446B5E6dDC0350EB83AEC factory

The liquidityManage address is `0x936c9A1B8f88BFDbd5066ad08e5d773BC82EB15F`, When adding liquidity, it will transfer WETH/ETH to this contract. When removing liquidity, it will transfer WETH/ETH from this contract.

```
event AddLiquidity(
    uint256 indexed nftId,
    address pool,
    uint128 liquidityDelta,
    uint256 amountX,
    uint256 amountY
);

event DecLiquidity(
    uint256 indexed nftId,
    address pool,
    uint128 liquidityDelta,
    uint256 amountX,
    uint256 amountY
);

// method
update
```

The total balance locked in pool should be sum by the following pool

0x33D9936b7B7BC155493446B5E6dDC0350EB83AEC createPool

- 0xd4b701a553005464292e978efd8abc48252a7722 USDC.Arbi/ETH 6706
- 0x5457c04370c447aed563489d9fe0b1d057439e0b USDC/ETH
- 0xc2909feb6f46e19f2b40f9288ac63726d7c2612c USDT.Arbi/ETH 392843
- 0x28592307d115f883acc87763803c3679c0d42fb1 ETH/USDC.Linea 403
- 0x062c027e4736f90bb06ba4bfc8036f133fd99413 USDT/ETH
- 0xe3905d48be8aedb1be57c8ad924c40de7e4fb4ff USDT.Eth/ETH
- 0xe8a8f1d76625b03b787f6ed17bd746e0515f3aef USDT/ETH None
- 0x55a367cf8ba4ce47e48e41179de98c549f17a8e5 USDC.Eth/ETH
- 0xfa38f432429d59ba653d5746cfea4f734f2c251e USDC.Eth/ETH
- 0x82b7dbfdc869a529cbcfc89dc384b0222427ff91
- 0x39abf030516e346f6c6779d03b260a4449705ce0 USDC.op/ETH
- 0xbc2a3ff0ce7413c184086b532bc121318117cacb rsETH.Arbitrum/ETH
- 0x802e9743d3421ce5786bc24aac90bbba404f82dd USDC/ETH

## Project - LayerBank

> Tx with these two contract:

- Core `0x4Ac518DbF0CC730A1c880739CFa98fe0bB284959`
- LToken `0xb666582F612692525C4027d2a8280Ac06a055a95`

### **All type of transactions as below**

MarketListed

| Action   | TX sample                                                          | Share change | Event        |
| -------- | ------------------------------------------------------------------ | ------------ | ------------ |
| supply   | 0x00183e47e959ae59de282077ad2ce0b00e8699d74bc47e92506190292b72244a | &check;      | MarketSupply |
| withdraw | 0x76c1a783baa9287ba9e2d997b28548324e29d3b9bfc0cdc4f71cb915d4d3b452 | &check;      | MarketRedeem |
| borrow   | 0x3919e36bca90e165fc264b88ae23fb663e5340ec2368b70b826eb669ce87bec3 | x            | Borrow       |
| repay    | 0x3e889f21ba6a11adcb536200e00b6c3055a76b5b02634bae38ab73a0eca49c7f | x            | RepayBorrow  |

## Project - LinkSwap ⏰

The contract address

- SwapFactory `0x87929083ac2215cF3CE4936857D314aF6687C978`
- SwapRouter `0x3D31943303aC09F2B97DF88b61c70eF00B732EA8`, which interacts with users for swap transactions.

The sample of add/remove liquidity on LP `0x4eaDd78a23E152FeC2b63F0f5A3423bDa2207E9b`(tx: `0x680eae567411fa33e25c20a86c25b686bb5783cbc20ed121e86595a8b5bdbbb6`, `0x0a9cb596b7b25e91c510028a854345c5bf550efcd1d893a78611458b9ea6435f`), _transfer_ event occurred on the contract address `0x3D31943303aC09F2B97DF88b61c70eF00B732EA8`, The ETH was transferred between _SwapRouter_ and _EOA_ address, we can leverage this to accumulate/reduce the share of LP.

The total balance can be calculated by the following pools

```
Mint(address,uint256,uint256)

event Burn(
    address indexed sender, // LP
    uint amount0,
    uint amount1,
    address indexed to // LP
);
```

```json
[
  {
    "name": "WETH-USDC(ARB)",
    "address": "0x381D380B9f2398B8905E1d5EaB6C62309623898B"
  },
  {
    "name": "WETH-USDT(ARB)",
    "address": "0x60f9A429356a9CCc8f1F922c020A6178C95238fd"
  },
  {
    "name": "WETH-ETH(PUF)",
    "address": "0x69F33F33B4E56370951f6E3DbeeD475e6D6A19cD"
  },
  {
    "name": "WETH-WBTC",
    "address": "0x28B0b33d44bb3c17F9802724B36BEc5592B1515e"
  },
  {
    "name": "WETH-STONE(MANTA)",
    "address": "0xE7bbBbB7c4C5EC243E74a320CC0Db86A167235D4"
  },
  {
    "name": "WETH-ETH(MSW)",
    "address": "0xfd679aB33a57Ded7Eae1ce09384C84BdF5b9642D"
  },
  {
    "name": "WETH-ARB(ARB)",
    "address": "0xfA02c6A895C236436c7F24DC6fb3d0D45DFB8fE5"
  },
  {
    "name": "WETH-WMNT(MANTLE)",
    "address": "0x46eA688B6F7CBb02b763771F1DB392d44c7B8eFe"
  },
  {
    "name": "WETH-ETH(WST)",
    "address": "0x48894F442716b9e1f8e1D8D8aD4FB3548C4716d0"
  },
  {
    "name": "WETH-MANTA(MANTA)",
    "address": "0x86CFe0F6bdb14B0B35074492f0e91C7F25381A0f"
  },
  {
    "name": "WETH-USDC(ETH)",
    "address": "0xf5Fec5df952F6108288aEb463799825d4A8E8b51"
  },
  {
    "name": "WETH-USDT(ETH)",
    "address": "0x4c37D751a3bA4d26cf8edBFb0087E15b95E4675b"
  },
  {
    "name": "WETH-USDC(ARB1)",
    "address": "0x16F9368A101495263E3737EfD5a8F56D061B80Cb"
  },
  {
    "name": "WETH-ezETH(Arbitrum)",
    "address": "0xE7DC413122cfF607A4A20258638B794ED4b36341"
  },
  {
    "name": "WETH-ezETH(Ethereum)",
    "address": "0xc70Af974a14B13a9280936197Bc5eE63E5C0E042"
  },
  {
    "name": "WETH-mmETH(Ethereum)",
    "address": "0x5cCF6756bD652Ecf32594b9FFc55ee6fE9A5999c"
  },
  {
    "name": "WETH-rsETH(Ethereum)",
    "address": "0x4ee296D323e39b5601033592d94DcB28FD8951C7"
  },
  {
    "name": "WETH-nETH(Ethereum)",
    "address": "0x48f82952740D350352501B3F70549A71C950ED37"
  },
  {
    "name": "WETH-rswETH(Ethereum)",
    "address": "0xAaf2af8614ACcDe1C620d9Ae7b801018985F681b"
  },
  {
    "name": "WETH-swETH(Ethereum)",
    "address": "0x3582F02AE69B2d4199E06dedC98cE4Ab4a664C56"
  },
  {
    "name": "WETH-USDT(MERGE)",
    "address": "0x8e5aa41a021495b606F9181B508759a39Ac2c3e4"
  },
  {
    "name": "WETH-USDC(MERGE)",
    "address": "0x4eaDd78a23E152FeC2b63F0f5A3423bDa2207E9b"
  },
  {
    "name": "WETH-WBTC(MERGE)",
    "address": "0xe4Ce0F3d78F6Af688F44d746aCF4acdd36f740BE"
  },
  {
    "name": "WETH-USDC(Zksync)",
    "address": "0x46c4B734b1A00a66b8ec2818856f256837aDd78d"
  },
  {
    "name": "WETH-USDe(Ethereum)",
    "address": "0x7C06840353c129c1e53f709BdE404F447d793371"
  },
  {
    "name": "WETH-wUSDM(Manta)",
    "address": "0x66b8d7CCDb8735ed495505343b6381e2C38a6D16"
  }
]
```

## Project - Aqua

0xE0dC68AE19D82b3b56BCbfe8e022F04da17A3e7B AquaLpToken implement contracts

The AQ-LP-ETH token is `0x9e5CabD99Dfb4e4a0C3Ea6Fe9c3E1A4ce4f5Fce5`

## Project - NativeX

Swap, the related contract including `0xf79D2ba9a8cbB68ad475CF0c323BC61502BED786` and `0x4712707F93Ea7544052Cbb2616D9407578cC149b`

## Project - ZKDX

Deposit and Withdraw, they only interact with contract `0xb5e635f2cB9eAC385D679069f8e0d1740436b355`,
the fragment is

- `Withdraw(msg.sender, _amount);`
- `Stake(msg.sender, msg.value);`
