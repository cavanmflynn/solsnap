import { Wallet } from '../interfaces';
import { updateTransactionInState } from '../solana';
import { Connection, Transaction } from '@solana/web3.js';

export const sendTransaction = async (wallet: Wallet, connection: Connection, transaction: Transaction) => {
  const signature = await connection.sendRawTransaction(transaction.serialize());
  const status = {
    signature,
    transaction,
  };
  updateTransactionInState(wallet, status);
  return status;
};
