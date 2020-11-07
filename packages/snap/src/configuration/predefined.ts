import { SnapConfig } from '@solana-tools/solsnap-types';
import { clusterApiUrl } from '@solana/web3.js';

export const solanaMainnetConfiguration: SnapConfig = {
  derivationPath: "m/44'/501'/0'/0/0",
  network: 's',
  rpc: {
    token: '',
    url: clusterApiUrl('mainnet-beta'),
  },
  unit: {
    decimals: 10,
    image: 'https://cryptologos.cc/logos/solana-sol-logo.svg?v=007',
    symbol: 'SOL',
  },
};

export const solanaTestnetConfiguration: SnapConfig = {
  derivationPath: "m/44'/1'/0'/0/0",
  network: 't',
  rpc: {
    token: '',
    url: clusterApiUrl('testnet'),
  },
  unit: {
    decimals: 10,
    image: 'https://cryptologos.cc/logos/solana-sol-logo.svg?v=007',
    symbol: 'SOL',
  },
};

export const defaultConfiguration: SnapConfig = solanaMainnetConfiguration;
