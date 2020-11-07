import { Wallet } from '../interfaces';
import { getConfiguration } from '../configuration';
import { Connection } from '@solana/web3.js';

export function getConnection(wallet: Wallet): Connection {
  const configuration = getConfiguration(wallet);
  return new Connection(configuration.rpc.url);
}
