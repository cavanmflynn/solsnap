import { Wallet } from '../interfaces';
import { getKeyPair } from '../solana';

export const getPublicKey = async (wallet: Wallet): Promise<string> => {
  return (await getKeyPair(wallet)).publicKey;
}
