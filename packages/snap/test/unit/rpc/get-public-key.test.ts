import { WalletMock } from '../wallet.mock.test';
import { testBip44Entropy, testPublicKey } from './key-pair-test-constants';
import chai, { expect } from 'chai';
import sinonChai from 'sinon-chai';
import { getPublicKey } from '../../../src/rpc/get-public-key';
import { SnapConfig } from '@solana-tools/solsnap-types';

chai.use(sinonChai);

describe('Test rpc handler function: getPublicKey', function () {
  const walletStub = new WalletMock();

  afterEach(function () {
    walletStub.reset();
  });

  it('should return valid address', async function () {
    walletStub.send.returns(testBip44Entropy);
    walletStub.getPluginState.returns({
      solana: {
        config: {
          network: 's',
          derivationPath: "m/44'/501'/0'/0/0",
        } as SnapConfig,
      },
    });
    const result = await getPublicKey(walletStub);
    expect(result).to.be.eq(testPublicKey);
  });
});
