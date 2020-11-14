import { hasMetaMask, isMetamaskSnapsSupported, isSnapInstalled } from './utils';
import { MetamaskSolanaSnap as MSSnap } from './snap';
import { SnapConfig } from '@solana-tools/solsnap-types';

const defaultSnapOrigin = 'https://bafybeigzphbumdkucnj2c6nr5xb3kwsq5gs2gp7w3qldgbvfeycfsbjylu.ipfs.infura-ipfs.io';
const defaultSnapId = `wallet_plugin_${defaultSnapOrigin}`;

export type MetamaskSolanaSnap = MSSnap;

export { hasMetaMask, isMetamaskSnapsSupported } from './utils';

/**
 * Install and enable Solana snap
 *
 * Checks for existence of Metamask and version compatibility with snaps before installation.
 *
 * Provided snap configuration must define at least network property so predefined configuration can be selected.
 * All other properties are optional, and if present will overwrite predefined property.
 *
 * @param config - SnapConfig
 * @param pluginOrigin
 *
 * @return MetamaskSolanaSnap - adapter object that exposes snap API
 */
export const enableSolanaSnap = async (
  config: Partial<SnapConfig>,
  pluginOrigin?: string,
): Promise<MetamaskSolanaSnap> => {
  let snapId = defaultSnapId;
  if (pluginOrigin) {
    snapId = `wallet_plugin_${pluginOrigin}`;
  }

  // check all conditions
  if (!hasMetaMask()) {
    throw new Error('Metamask is not installed');
  }
  if (!(await isMetamaskSnapsSupported())) {
    throw new Error("Current Metamask version doesn't support snaps");
  }
  if (!config.network) {
    throw new Error('Configuration must at least define network type');
  }

  // Enable snap
  if (!(await isSnapInstalled(snapId))) {
    await window.ethereum.send({
      method: 'wallet_enable',
      params: [
        {
          [snapId]: {},
        },
      ],
    });
  }

  // Create snap describer
  const snap = new MSSnap(pluginOrigin || defaultSnapOrigin);
  // Set initial configuration
  await (await snap.getSolanaSnapApi()).configure(config);
  // Return snap object
  return snap;
};
