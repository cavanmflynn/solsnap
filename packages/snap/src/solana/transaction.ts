import { Wallet } from '../interfaces';
import { Transaction, SerializeConfig } from '@solana/web3.js';
import { TransactionStatus } from '@solana-tools/solsnap-types';
import { Buffer } from 'buffer';

export function updateTransactionInState(wallet: Wallet, transaction: TransactionStatus): void {
  const state = wallet.getPluginState();
  const index = state.solana.transactions.findIndex(tx => tx.signature === transaction.signature);
  if (index >= 0) {
    state.solana.transactions[index] = transaction;
  } else {
    state.solana.transactions.push(transaction);
  }
  wallet.updatePluginState(state);
}

export function toBase64(transaction: Transaction, opts: SerializeConfig = { verifySignatures: false }): string {
  return transaction.serialize(opts).toString('base64');
}

export function fromBase64(transaction: string): Transaction {
  return Transaction.from(Buffer.from(transaction, 'base64'));
}
