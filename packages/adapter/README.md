# SolSnap adapter
![](https://github.com/cavanmflynn/solsnap/workflows/ci/badge.svg)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
![](https://img.shields.io/badge/yarn-%3E%3D1.17.0-orange.svg?style=flat-square)
![Discord](https://img.shields.io/discord/608204864593461248?color=blue&label=Discord&logo=discord)

SolSnap adapter is used to install Solana snap and expose API toward snap.

For more details on Solana snap itself see [snap repo](https://github.com/cavanmflynn/solsnap) or read full [Solana snap documentation](https://github.com/cavanmflynn/solsnap/wiki).

## Usage

Adapter has only exposed function for installing Solana snap.

```typescript
async function enableSolanaSnap(
  config: Partial<SnapConfig>, 
  pluginOrigin?: string
): Promise<MetamaskSolanaSnap> 
```

On snap installation, it is possible to send full or partial configuration.
If you only provide `network` property a predefined configuration for the specified network will be used.
Other properties are optional but will override default values if provided.

Below you can see structure of config object:

```typescript
export interface SnapConfig {
  derivationPath: string;
  token: string;
  network: SolanaNetwork; // 's' || 't'
  rpcUrl: string;
  unit?: UnitConfiguration;
}

export interface UnitConfiguration {
  symbol: string;
  decimals: number;
  image?: string;
  customViewUrl?: string;
}
```

After snap installation, this function returns `MetamaskSolanaSnap` object that can be used to retrieve snap API. 
An example of initializing Solana snap and invoking snap API is shown below.

```typescript
// Install snap and fetch API
const snap = await enableSolanaSnap({ network: 't' });
const api = await snap.getSolanaSnapApi();

// Invoke API
const address = await api.getAddress();

console.log(`Snap installed, account generated with address: ${address}`);
```
