import { Wallet } from '../interfaces';
import { getAddress } from './get-address';
import { Connection, PublicKey } from '@solana/web3.js';

export const getBalance = async (wallet: Wallet, connection: Connection, address?: string): Promise<string> => {
  if (!address) {
    address = await getAddress(wallet);
  }
  const balance = await connection.getBalance(new PublicKey(address));
  return String(balance); // TODO: Is this in base units?
}
