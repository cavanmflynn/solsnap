# Solsnap
![](https://github.com/cavanmflynn/solsnap/workflows/ci/badge.svg)
![](https://img.shields.io/badge/yarn-%3E%3D1.17.0-orange.svg?style=flat-square)
![](https://img.shields.io/badge/Node.js-%3E%3D12.x-orange.svg?style=flat-square)

Metamask snap (plugin) to enable Metamask users interaction with solana dapps.

**For detailed documentation and integration instructions see [wiki](https://github.com/cavanmflynn/solsnap/wiki).**

### Testing Solsnap

#### Metamask

First, install the beta release of Metamask plugin: 

- [Download latest Metamask snaps beta release](https://github.com/NodeFactoryIo/metamask-snaps-beta/releases) (chrome recommended)
  - If you have another version of MetaMask installed, temporarily disable it.
- Extract downloaded archive
- Go to [chrome://extensions/](chrome://extensions/)
- Enable "Developer mode"
- Click "Load unpacked" and point to extracted archive chrome directory

#### Demo DAPP

##### Live demo

Test Solsnap inside [our demo DAPP.](https://solsnap.netlify.app/)

##### Running Solsnap demo locally

Start our demo locally by running:

- `yarn install`
- `yarn run demo`

## License

This project is dual-licensed under Apache 2.0 and MIT terms:
- Apache License, Version 2.0, ([LICENSE-APACHE](LICENSE-APACHE) or http://www.apache.org/licenses/LICENSE-2.0)
- MIT license ([LICENSE-MIT](LICENSE-MIT) or http://opensource.org/licenses/MIT)
