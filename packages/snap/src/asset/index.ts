import { SolanaNetwork, SnapConfig } from '@solana-tools/solsnap-types';
import { Asset, Wallet } from '../interfaces';
import { executeAssetOperation } from './action';
import { getConfiguration } from '../configuration';
import { getAddress } from '../rpc/get-address';

export const SOLANA_SNAP_ASSET_IDENTIFIER = 'solana-snap-asset';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function formatBalance(balance: number | string, decimals: number): string {
  return balance as string;
}

export function getSolanaAssetDescription(
  balance: number | string,
  address: string,
  configuration: SnapConfig,
): Asset {
  return {
    balance: formatBalance(balance, configuration.unit.decimals),
    customViewUrl: configuration.unit.customViewUrl || `https://explorer.solana.com/address/${address}`,
    decimals: 0,
    identifier: SOLANA_SNAP_ASSET_IDENTIFIER,
    image: configuration.unit.image || '',
    symbol: configuration.unit.symbol,
  };
}

let assetState: { balance: string | number; network: SolanaNetwork };

export async function updateAsset(wallet: Wallet, origin: string, balance: number | string): Promise<void> {
  const configuration = getConfiguration(wallet);
  const asset = getSolanaAssetDescription(balance, await getAddress(wallet), configuration);
  if (!assetState) {
    // create solana snap asset
    await executeAssetOperation(asset, wallet, 'add');
  } else if (assetState.balance !== asset.balance || assetState.network !== configuration.network) {
    // update if balance or network changed
    await executeAssetOperation(asset, wallet, 'update');
  }
  assetState = { balance: asset.balance, network: configuration.network };
}
