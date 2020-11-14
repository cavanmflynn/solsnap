import { TransactionStatus, MetamaskSolanaRpcRequest, SnapConfig } from '@solana-tools/solsnap-types';
import { MetamaskSolanaSnap } from './snap';

async function sendSnapMethod<T>(request: MetamaskSolanaRpcRequest, snapId: string): Promise<T> {
  return window.ethereum.send({
    method: snapId,
    params: [request],
  });
}

export async function getAddress(this: MetamaskSolanaSnap): Promise<string> {
  return sendSnapMethod({ method: 'sol_getAddress' }, this.snapId);
}

export async function getBalance(this: MetamaskSolanaSnap): Promise<string> {
  return sendSnapMethod({ method: 'sol_getBalance' }, this.snapId);
}

export async function getRecentBlockhash(this: MetamaskSolanaSnap): Promise<string> {
  return sendSnapMethod({ method: 'sol_getRecentBlockhash' }, this.snapId);
}

export async function exportPrivateKey(this: MetamaskSolanaSnap): Promise<string> {
  return sendSnapMethod({ method: 'sol_exportPrivateKey' }, this.snapId);
}

export async function configure(this: MetamaskSolanaSnap, configuration: SnapConfig): Promise<void> {
  return sendSnapMethod({ method: 'sol_configure', params: { configuration } }, this.snapId);
}

export async function signTransaction(this: MetamaskSolanaSnap, transaction: string): Promise<string> {
  return sendSnapMethod({ method: 'sol_signTransaction', params: { transaction } }, this.snapId);
}

export async function sendTransaction(this: MetamaskSolanaSnap, signedTransaction: string): Promise<TransactionStatus> {
  return sendSnapMethod({ method: 'sol_sendTransaction', params: { signedTransaction } }, this.snapId);
}

export async function getTransactions(this: MetamaskSolanaSnap): Promise<TransactionStatus[]> {
  return sendSnapMethod({ method: 'sol_getTransactions' }, this.snapId);
}
