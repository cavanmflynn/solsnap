import { SnapRpcMethodRequest } from '@solana-tools/solsnap-types';
import { enableSolanaSnap, MetamaskSolanaSnap } from '@solana-tools/solsnap-adapter';

declare global {
  interface Window {
    ethereum: {
      isMetaMask: boolean;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      send: <T>(request: SnapRpcMethodRequest | { method: string; params?: any[] }) => Promise<T>;
      on: (eventName: unknown, callback: unknown) => unknown;
      // requestIndex: () => Promise<{getPluginApi: (origin: string) => Promise<FilecoinApi>}>;
    };
  }
}

export const localOrigin = new URL('package.json', 'http://localhost:8081').toString();

let isInstalled: boolean = false;

export interface SnapInitializationResponse {
  isSnapInstalled: boolean;
  snap?: MetamaskSolanaSnap;
}

export async function installSolanaSnap(): Promise<SnapInitializationResponse> {
  try {
    console.log('installing snap');
    let metamaskSolanaSnap;
    if (process.env.REACT_APP_SNAP === 'local') {
      metamaskSolanaSnap = await enableSolanaSnap({ network: 's' }, localOrigin);
    } else {
      metamaskSolanaSnap = await enableSolanaSnap({ network: 's' });
    }
    isInstalled = true;
    console.log('Snap installed!!');
    return { isSnapInstalled: true, snap: metamaskSolanaSnap };
  } catch (e) {
    console.log(e);
    isInstalled = false;
    return { isSnapInstalled: false };
  }
}

export async function isSolanaSnapInstalled(): Promise<boolean> {
  return isInstalled;
}
