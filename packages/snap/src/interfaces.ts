import { TransactionStatus, MetamaskSolanaRpcRequest, SnapConfig } from '@solana-tools/solsnap-types';
import { defaultConfiguration } from './configuration/predefined';

export type FMethodCallback = (originString: string, requestObject: MetamaskSolanaRpcRequest) => Promise<unknown>;

export type MetamaskState = {
  solana: {
    config: SnapConfig;
    transactions: TransactionStatus[];
  };
};

export const EmptyMetamaskState: () => MetamaskState = () => ({
  solana: { config: defaultConfiguration, transactions: [] },
});

export interface Wallet {
  registerApiRequestHandler: (origin: unknown) => unknown;
  registerRpcMessageHandler: (fn: FMethodCallback) => unknown;
  send(options: { method: string; params: unknown[] }): unknown;
  getAppKey(): Promise<string>;
  updatePluginState(state: MetamaskState): void;
  getPluginState(): MetamaskState;
}

export interface Asset {
  balance: string | number;
  customViewUrl?: string;
  decimals?: number;
  identifier: string;
  image?: string;
  symbol: string;
}
