import chai, { expect } from 'chai';
import sinonChai from 'sinon-chai';
import { WalletMock } from '../wallet.mock.test';
import { getBalance } from '../../../src/rpc/get-balance';
import { testBip44Entropy } from './key-pair-test-constants';
import { EmptyMetamaskState } from '../../../src/interfaces';
import { createConnectionStub } from '../connection.mock.test';

chai.use(sinonChai);

describe('Test rpc handler function: getBalance', function () {
  const walletStub = new WalletMock();
  const connectionStub = createConnectionStub();

  afterEach(function () {
    walletStub.reset();
  });

  it('should return balance on saved keyring in state', async function () {
    // Prepare stubs
    walletStub.send.returns(testBip44Entropy);
    walletStub.getPluginState.returns(EmptyMetamaskState());
    connectionStub.getBalance.returns(Promise.resolve(3000000000));
    // Call getBalance
    const result = await getBalance(walletStub, connectionStub);
    // Assertions
    expect(walletStub.getAppKey).to.have.not.been.called;
    expect(walletStub.getPluginState).to.have.been.calledOnce;
    expect(result).to.be.eq('3');
  });
});
