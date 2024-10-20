import { Address, BigInt } from "@graphprotocol/graph-ts";
import { Transfer, Holder } from "../generated/schema"
import { Transfer as TransferEvent } from "../generated/ZkLinkToken/ZkLinkToken"

const masterAddresses: Address[] = [
  Address.fromString("0x8d1f2ebfaccf1136db76fdd1b86f1dede2d23852"),
  Address.fromString("0x2dc1a672DC57CC8F115ff04ADE40d2E507E05609"),
  Address.fromString("0xC9A3Cf506180757AcfCbE8D78B73E5335926e65B"),
  Address.fromString("0x82C1889F00EfcDaB3Cde8Ce2DBAAEa57f8Dd6D0B"),
  Address.fromString("0x223e33eBBD7005D5a7C6ef4BAA35eBd74C691D79"),
  Address.fromString("0x262cac775BBe38f161275B5d25bD365B20a2Ed00"),
  Address.fromString("0x2123f6d10B580BAf5Eb25a16Bf62F2782cc514C6"),
  Address.fromString("0xFc9A15305cac5f42794deF87E63f19f0Eb6c4cFe"),
  Address.fromString("0x293C68cE1e1E79aAA7880E7d41f5984fE1665Ee8"),
  Address.fromString("0xd0AF224641A7EA8CfC88Df6Ed2C7133C6bE16939"),
  Address.fromString("0x4C574Ff0aA0CAcB33142CBD7435ae5132CA1F66A"),
  Address.fromString("0xf89d7b9c864f589bbF53a82105107622B35EaA40"),
  Address.fromString("0xD1669Ac6044269b59Fa12c5822439F609Ca54F41"),
  Address.fromString("0x58edF78281334335EfFa23101bBe3371b6a36A51"),
  Address.fromString("0x0D0707963952f2fBA59dD06f2b425ace40b492Fe"),
  Address.fromString("0x1AB4973a48dc892Cd9971ECE8e01DcC7688f8F23"),
  Address.fromString("0x75e89d5979E4f6Fba9F97c104c2F0AFB3F1dcB88"),
  Address.fromString("0x5569fd6991D1802dbeE9bDD67e763fe7be67C7a9"),
  Address.fromString("0xf89d7b9c864f589bbF53a82105107622B35EaA40"),
  Address.fromString("0x1AB4973a48dc892Cd9971ECE8e01DcC7688f8F23"),
  Address.fromString("0x0D0707963952f2fBA59dD06f2b425ace40b492Fe"),
  Address.fromString("0xDFcB5Ead2a58b2873C1AdFdb9E313b14aaF6fb21"),
  Address.fromString("0x76c7B2f0415a42945C1b2Ef086bbCfCff2F2178C"),
  Address.fromString("0x36a7e7b737a1bb41a42802258c3969fd16ad5c19"),
  Address.fromString("0xd264f7001F84f25958041B6E622573460db1e8e2"),
  Address.fromString("0x3c72958D94171Fb9C7F1AbD98EE3fF385a5E2f07"),
  Address.fromString("0xBc6c0Dd07E8CadC730b57ad96028D965ad391e45"),
];

function isMasterAddress(address: Address): bool {
  return masterAddresses.includes(address);
}

export function handleTransfer(event: TransferEvent): void {
  let transfer = new Transfer(event.transaction.hash);
  transfer.from = event.params.from;
  transfer.to = event.params.to;
  transfer.value = event.params.value;
  transfer.blockNumber = event.block.number;
  transfer.blockTimestamp = event.block.timestamp;
  transfer.transactionHash = event.transaction.hash;

  // Save the transfer entity
  transfer.save();

  // Load or create Holder for `from` and `to` addresses
  let fromHolder = Holder.load(event.params.from);
  let toHolder = Holder.load(event.params.to);

  if (!fromHolder) {
    fromHolder = new Holder(event.params.from);
    fromHolder.accountType = "onChain";
    fromHolder.balance = BigInt.fromI32(0);
  }

  if (!toHolder) {
    toHolder = new Holder(event.params.to);
    toHolder.accountType = "onChain";
    toHolder.balance = BigInt.fromI32(0);
  }

  fromHolder.balance = fromHolder.balance.minus(event.params.value);
  toHolder.balance = toHolder.balance.plus(event.params.value);

  // Check if `to` is a master address
  if (isMasterAddress(event.params.to)) {
    fromHolder.accountType = "subAccount";
    toHolder.accountType = "master";
  }

  // Save both Holders
  fromHolder.save();
  toHolder.save();
}

