
import { Vault, Share } from '../generated/schema'
import { MultiPositionLiquidityManager as MultiPositionLiquidityManagerTemplate } from '../generated/templates'
import { VaultCreated, VaultRegistry } from '../generated/SteerProtocol/VaultRegistry'
import { Deposit, Withdraw, MultiPositionLiquidityManager } from '../generated/SteerProtocol/MultiPositionLiquidityManager'
import { BigInt } from '@graphprotocol/graph-ts'

export function handleVaultCreated(event: VaultCreated): void {
    const vaultAddress = event.params.vault
    const multiPositionLiquidityManager = MultiPositionLiquidityManager.bind(vaultAddress)

    const VaultRegistryContract = VaultRegistry.bind(event.address)
    const vaultDetails = VaultRegistryContract.getVaultDetails(vaultAddress)

    const vaultInstance = new Vault(vaultAddress)
    vaultInstance.totalSupply = BigInt.zero()
    vaultInstance.state = vaultDetails.state
    vaultInstance.pool = multiPositionLiquidityManager.pool()
    vaultInstance.save()

    MultiPositionLiquidityManagerTemplate.create(vaultAddress)
}

export function handleDeposit(event: Deposit): void {
    const vaultAddress = event.address
    const userAddress = event.params.to
    let share = Share.load(userAddress)
    if (!share) {
        share = new Share(userAddress)
        share.sharesAmount = event.params.shares
    } else {
        share.sharesAmount = share.sharesAmount.plus(event.params.shares)
    }
    share.vault = vaultAddress
    share.save()

    let vaultInstance = Vault.load(vaultAddress)
    if (!vaultInstance) {
        vaultInstance = new Vault(vaultAddress)
        vaultInstance.totalSupply = BigInt.zero()
    }
    vaultInstance.totalSupply = vaultInstance.totalSupply.plus(event.params.shares)
    vaultInstance.save()
}

export function handleWithdraw(event: Withdraw): void {
    const vaultAddress = event.address
    const userAddress = event.params.to
    let share = Share.load(userAddress)
    if (!share) {
        share = new Share(userAddress)
        share.sharesAmount = BigInt.zero()
    } else {
        share.sharesAmount = share.sharesAmount.minus(event.params.shares)
    }
    share.vault = vaultAddress
    share.save()

    let vaultInstance = Vault.load(vaultAddress)
    if (!vaultInstance) {
        vaultInstance = new Vault(vaultAddress)
        vaultInstance.totalSupply = BigInt.zero()
    }
    vaultInstance.totalSupply = vaultInstance.totalSupply.minus(event.params.shares)
    vaultInstance.save()
}




