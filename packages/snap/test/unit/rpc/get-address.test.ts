import chai, { expect } from 'chai';
import sinonChai from 'sinon-chai';
import { WalletMock } from '../wallet.mock.test';
import { getAddress } from '../../../src/rpc/get-address';
import { testBip44Entropy, testAddress } from './key-pair-test-constants';
import { SnapConfig } from '@solana-tools/solsnap-types';

chai.use(sinonChai);

describe('Test rpc handler function: getAddress', function () {
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
    const result = await getAddress(walletStub);
    expect(result).to.be.eq(testAddress);
  });
});
