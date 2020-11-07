import { SolanaSnapApi } from '@solana-tools/solsnap-types';
import {
  configure,
  exportPrivateKey,
  getAddress,
  getBalance,
  getTransactions,
  getPublicKey,
  sendTransaction,
  signTransaction,
} from './methods';

export class MetamaskSolanaSnap {
  // Snap parameters
  protected readonly pluginOrigin: string;
  protected readonly snapId: string;

  public constructor(pluginOrigin: string) {
    this.pluginOrigin = pluginOrigin;
    this.snapId = `wallet_plugin_${this.pluginOrigin}`;
  }

  public getSolanaSnapApi = async (): Promise<SolanaSnapApi> => {
    return {
      configure: configure.bind(this),
      exportPrivateKey: exportPrivateKey.bind(this),
      getAddress: getAddress.bind(this),
      getBalance: getBalance.bind(this),
      getTransactions: getTransactions.bind(this),
      getPublicKey: getPublicKey.bind(this),
      sendTransaction: sendTransaction.bind(this),
      signTransaction: signTransaction.bind(this),
    };
  };
}
