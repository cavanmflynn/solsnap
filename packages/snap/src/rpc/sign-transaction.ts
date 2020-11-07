import { Account, Transaction } from '@solana/web3.js';
import { showConfirmationDialog } from '../util/confirmation';
import { Wallet } from '../interfaces';
import { getKeyPair } from '../solana';
import { Buffer } from 'buffer';
import nacl from 'tweetnacl';

export const signTransaction = async (wallet: Wallet, transaction: Transaction) => {
  const confirmation = await showConfirmationDialog(
    wallet,
    'Do you want to sign transaction\n\n' +
      `instructions: ${JSON.stringify(transaction.instructions)}\n` +
      `nonce: ${transaction.nonceInfo?.nonce}?`,
  );
  if (confirmation) {
    const { privateKey } = await getKeyPair(wallet);
    const keyPair = nacl.sign.keyPair.fromSeed(
      Buffer.from(privateKey, 'hex'),
    );
    transaction.sign(new Account(keyPair.secretKey));
    if (!transaction.signature) {
      throw new Error('Failed to sign transaction');
    }
    return transaction;
  }
  return null;
};
