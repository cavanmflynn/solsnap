import {
  TransactionStatus,
  MetamaskSolanaRpcRequest,
  SnapConfig,
} from '@solana-tools/solsnap-types';
import { Transaction } from '@solana/web3.js';
import { MetamaskSolanaSnap } from './snap';

async function sendSnapMethod<T>(request: MetamaskSolanaRpcRequest, snapId: string): Promise<T> {
  return await window.ethereum.send({
    method: snapId,
    params: [request],
  });
}

export async function getAddress(this: MetamaskSolanaSnap): Promise<string> {
  return await sendSnapMethod({ method: 'sol_getAddress' }, this.snapId);
}

export async function getPublicKey(this: MetamaskSolanaSnap): Promise<string> {
  return await sendSnapMethod({ method: 'sol_getPublicKey' }, this.snapId);
}

export async function getBalance(this: MetamaskSolanaSnap): Promise<string> {
  return await sendSnapMethod({ method: 'sol_getBalance' }, this.snapId);
}

export async function exportPrivateKey(this: MetamaskSolanaSnap): Promise<string> {
  return await sendSnapMethod({ method: 'sol_exportPrivateKey' }, this.snapId);
}

export async function configure(this: MetamaskSolanaSnap, configuration: SnapConfig): Promise<void> {
  return await sendSnapMethod({ method: 'sol_configure', params: { configuration } }, this.snapId);
}

export async function signTransaction(this: MetamaskSolanaSnap, transaction: Transaction): Promise<Transaction> {
  return await sendSnapMethod({ method: 'sol_signTransaction', params: { transaction } }, this.snapId);
}

export async function sendTransaction(this: MetamaskSolanaSnap, signedTransaction: Transaction): Promise<TransactionStatus> {
  return await sendSnapMethod({ method: 'sol_sendTransaction', params: { signedTransaction } }, this.snapId);
}

export async function getTransactions(this: MetamaskSolanaSnap): Promise<TransactionStatus[]> {
  return await sendSnapMethod({ method: 'sol_getTransactions' }, this.snapId);
}
