import { Wallet } from '../interfaces';
import { TransactionStatus } from '@solana-tools/solsnap-types';

export const getTransactions = (wallet: Wallet): TransactionStatus[] => {
  return wallet.getPluginState().solana.transactions;
}
