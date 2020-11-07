import { EmptyMetamaskState, Wallet } from './interfaces';
import { SolanaEventApi } from '@solana-tools/solsnap-types';
import { getAddress } from './rpc/get-address';
import { exportPrivateKey } from './rpc/export-private-key';
import { getPublicKey } from './rpc/get-public-key';
import { getConnection } from './solana';
import { getBalance } from './rpc/get-balance';
import { configure } from './rpc/configure';
import { updateAsset } from './asset';
import { getTransactions } from './rpc/get-transactions';
import { signTransaction } from './rpc/sign-transaction';
import { sendTransaction } from './rpc/send-transaction';
import { Connection } from '@solana/web3.js';

declare let wallet: Wallet;

const apiDependentMethods = ['sol_getBalance', 'sol_signTransaction', 'sol_sendTransaction' /*, 'sol_getGasForMessage' */];

// eslint-disable-next-line @typescript-eslint/no-unused-vars
wallet.registerApiRequestHandler(async function (_: URL): Promise<SolanaEventApi> {
  return {};
});

wallet.registerRpcMessageHandler(async (originString, requestObject) => {
  const state = wallet.getPluginState();
  if (!state) {
    // Initialize state if empty and set default config
    wallet.updatePluginState(EmptyMetamaskState());
  }

  let connection: Connection;
  // Initialize connection if needed
  if (apiDependentMethods.indexOf(requestObject.method) >= 0) {
    connection = getConnection(wallet);
  }

  switch (requestObject.method) {
    case 'sol_configure':
      const configuration = configure(
        wallet,
        requestObject.params.configuration.network,
        requestObject.params.configuration,
      );
      connection = getConnection(wallet);
      await updateAsset(wallet, originString, await getBalance(wallet, connection));
      return configuration;
    case 'sol_getAddress':
      return getAddress(wallet);
    case 'sol_getPublicKey':
      return getPublicKey(wallet);
    case 'sol_exportPrivateKey':
      return exportPrivateKey(wallet);
    case 'sol_getBalance':
      const balance = await getBalance(wallet, connection);
      await updateAsset(wallet, originString, balance);
      return balance;
    case 'sol_getTransactions':
      return getTransactions(wallet);
    case 'sol_signTransaction':
      return signTransaction(wallet, requestObject.params.transaction);
    case 'sol_sendTransaction':
      return sendTransaction(wallet, connection, requestObject.params.signedTransaction);
    default:
      throw new Error('Unsupported RPC method');
  }
});
