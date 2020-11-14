import { Wallet } from '../interfaces';
import { fromBase64, updateTransactionInState } from '../solana';
import { Connection } from '@solana/web3.js';
import { Buffer } from 'buffer';

export const sendTransaction = async (wallet: Wallet, connection: Connection, transaction: string) => {
  const signature = await connection.sendRawTransaction(Buffer.from(transaction, 'base64'));
  const status = {
    signature,
    transaction: fromBase64(transaction),
  };
  updateTransactionInState(wallet, status);
  return status;
};
