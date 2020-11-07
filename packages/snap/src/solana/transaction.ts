import { Wallet } from '../interfaces';
import { TransactionStatus } from '@solana-tools/solsnap-types';

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
