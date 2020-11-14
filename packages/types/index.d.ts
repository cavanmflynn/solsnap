import { Transaction } from '@solana/web3.js';

export interface GetAddressRequest {
  method: 'sol_getAddress';
}

export interface ExportSeedRequest {
  method: 'sol_exportPrivateKey';
}

export interface ConfigureRequest {
  method: 'sol_configure';
  params: {
    configuration: SnapConfig;
  };
}

export interface SignTransactionRequest {
  method: 'sol_signTransaction';
  params: {
    transaction: string;
  };
}

export interface SendTransactionRequest {
  method: 'sol_sendTransaction';
  params: {
    signedTransaction: string;
  };
}

export interface GetBalanceRequest {
  method: 'sol_getBalance';
}

export interface GetRecentBlockhashRequest {
  method: 'sol_getRecentBlockhash';
}

export interface GetTransactionsRequest {
  method: 'sol_getTransactions';
}

export type MetamaskSolanaRpcRequest =
    GetAddressRequest |
    ExportSeedRequest |
    ConfigureRequest |
    GetBalanceRequest |
    GetRecentBlockhashRequest |
    GetTransactionsRequest |
    SignTransactionRequest |
    SendTransactionRequest;

type Method = MetamaskSolanaRpcRequest['method'];

export interface WalletEnableRequest {
  method: 'wallet_enable';
  params: object[];
}

export interface GetPluginsRequest {
  method: 'wallet_getPlugins';
}

export interface SnapRpcMethodRequest {
  method: string;
  params: [MetamaskSolanaRpcRequest];
}

export type MetamaskRpcRequest = WalletEnableRequest | GetPluginsRequest | SnapRpcMethodRequest;

export interface UnitConfiguration {
  symbol: string;
  decimals: number;
  image?: string;
  customViewUrl?: string;
}

export interface SnapConfig {
  derivationPath: string;
  network: SolanaNetwork;
  rpc: {
    token: string;
    url: string;
  };
  unit?: UnitConfiguration;
}

export type Callback<T> = (arg: T) => void;

// Solana types

export interface TransactionStatus {
  transaction: Transaction;
  signature: string;
}

export type SolanaNetwork = 's' | 't';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface SolanaEventApi {}

export interface SolanaSnapApi {
  getAddress(): Promise<string>;
  getBalance(): Promise<string>;
  getRecentBlockhash(): Promise<string>;
  exportPrivateKey(): Promise<string>;
  configure(configuration: Partial<SnapConfig>): Promise<void>;
  signTransaction(transaction: string): Promise<string>;
  sendTransaction(signedTransaction: string): Promise<TransactionStatus>;
  getTransactions(): Promise<TransactionStatus[]>;
}

export interface KeyPair {
  address: string;
  privateKey: string;
}
