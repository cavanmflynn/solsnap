import { Wallet } from '../interfaces';
import { showConfirmationDialog } from '../util/confirmation';
import { getKeyPair } from '../solana';

export const exportPrivateKey = async (wallet: Wallet): Promise<string | null> => {
  const confirmation = await showConfirmationDialog(wallet, 'Do you want to export your private key?');
  if (confirmation) {
    return (await getKeyPair(wallet)).privateKey;
  }
  return null;
}
