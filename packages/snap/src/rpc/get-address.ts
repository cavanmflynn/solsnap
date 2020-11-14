import { Wallet } from '../interfaces';
import { getKeyPair } from '../solana';

export const getAddress = async (wallet: Wallet): Promise<string> => {
  return (await getKeyPair(wallet)).address;
};
