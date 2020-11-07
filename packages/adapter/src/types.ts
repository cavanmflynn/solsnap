import { SnapRpcMethodRequest } from '@solana-tools/solsnap-types';

declare global {
  interface Window {
    ethereum: {
      isMetaMask: boolean;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      send: <T>(request: SnapRpcMethodRequest | { method: string; params?: any[] }) => Promise<T>;
      on: (eventName: unknown, callback: unknown) => unknown;
    };
  }
}
