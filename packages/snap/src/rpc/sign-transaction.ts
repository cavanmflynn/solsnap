import { Account } from '@solana/web3.js';
import { showConfirmationDialog } from '../util/confirmation';
import { Wallet } from '../interfaces';
import { fromBase64, getKeyPair, toBase64 } from '../solana';
import { Buffer } from 'buffer';
import nacl from 'tweetnacl';

export const signTransaction = async (wallet: Wallet, tx: string) => {
  const transaction = fromBase64(tx);
  const instructions = transaction.instructions.map(instruction => ({
    keys: instruction.keys.map(key => ({
      pubkey: key.pubkey.toBase58(),
      isSigner: key.isSigner,
    })),
    data: instruction.data.toString('hex'),
    programId: instruction.programId.toBase58(),
  }));
  const confirmation = await showConfirmationDialog(
    wallet,
    'Do you want to sign the following transaction:\n\n' +
      `Instructions: ${JSON.stringify(instructions, null, 2)}\n` +
      `Fee Payer: ${transaction.feePayer?.toBase58()}\n` +
      `Recent Block Hash: ${transaction.recentBlockhash}?`,
  );
  if (confirmation) {
    const { privateKey } = await getKeyPair(wallet);
    const keyPair = nacl.sign.keyPair.fromSeed(Buffer.from(privateKey, 'hex'));
    transaction.sign(new Account(keyPair.secretKey));
    if (!transaction.signature) {
      throw new Error('Failed to sign transaction');
    }
    return toBase64(transaction);
  }
  return null;
};
