import { Wallet } from '../interfaces';
import { KeyPair } from '@solana-tools/solsnap-types';
import { deriveKeyFromPath } from '@metamask/key-tree';
import { Account } from '@solana/web3.js';
import { Buffer } from 'buffer';
import nacl from 'tweetnacl';

/**
 * Return derived KeyPair from seed.
 * @param wallet
 */
export const getKeyPair = async (wallet: Wallet): Promise<KeyPair> => {
  const pluginState = wallet.getPluginState();
  const { derivationPath } = pluginState.solana.config;
  const bip44Code = derivationPath.split('/')[2].split("'")[0];
  const rawBip44Entropy = await wallet.send({
    method: `wallet_getBip44Entropy_${bip44Code}`,
    params: [],
  });
  const bip44Entropy = Buffer.from(String(rawBip44Entropy), 'base64');
  // Metamask has supplied us with entropy for "m/purpose'/bip44Code'/"
  // We need to derive the final "accountIndex'/change/addressIndex"
  const accountIndex = 0;
  const addressIndex = 0;
  const keyMaterial = deriveKeyFromPath(bip44Entropy, `bip32:${accountIndex}'/bip32:0/bip32:${addressIndex}`);
  const privateKey = keyMaterial.slice(0, 32).toString('hex');
  const keyPair = nacl.sign.keyPair.fromSeed(Buffer.from(privateKey, 'hex'));
  const account = new Account(keyPair.secretKey);

  return {
    privateKey,
    address: account.publicKey.toBase58(),
  };
};
