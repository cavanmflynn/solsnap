import { Connection } from '@solana/web3.js';

export const getRecentBlockhash = async (connection: Connection): Promise<string> => {
  return (await connection.getRecentBlockhash()).blockhash;
};
