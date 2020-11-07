import { Wallet } from '../interfaces';
import { defaultConfiguration, solanaMainnetConfiguration, solanaTestnetConfiguration } from './predefined';
import { SnapConfig } from '@solana-tools/solsnap-types';

export function getDefaultConfiguration(networkName?: string): SnapConfig {
  switch (networkName) {
    case 's':
      console.log('Solana mainnet network selected');
      return solanaMainnetConfiguration;
    case 't':
      console.log('Solana testnet network selected');
      return solanaTestnetConfiguration;
    default:
      return defaultConfiguration;
  }
}

export function getConfiguration(wallet: Wallet): SnapConfig {
  const state = wallet.getPluginState();
  if (!state || !state.solana.config) {
    return defaultConfiguration;
  }
  return state.solana.config;
}
