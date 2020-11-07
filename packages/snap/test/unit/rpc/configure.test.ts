import chai, { expect } from 'chai';
import sinonChai from 'sinon-chai';
import { WalletMock } from '../wallet.mock.test';
import { solanaTestnetConfiguration } from '../../../src/configuration/predefined';
import { configure } from '../../../src/rpc/configure';
import { EmptyMetamaskState } from '../../../src/interfaces';
import { SnapConfig } from '@solana-tools/solsnap-types';

chai.use(sinonChai);

describe('Test rpc handler function: configure', function () {
  const walletStub = new WalletMock();

  afterEach(function () {
    walletStub.reset();
  });

  it('should set predefined solana configuration based on network', async function () {
    walletStub.getPluginState.returns(EmptyMetamaskState());
    walletStub.updatePluginState.returnsArg(0);

    const result = configure(walletStub, 't');

    expect(result).to.be.deep.eq(solanaTestnetConfiguration);
    expect(walletStub.updatePluginState).to.have.been.calledOnceWithExactly({
      solana: {
        config: solanaTestnetConfiguration,
        transactions: [],
      },
    });
    expect(walletStub.updatePluginState).to.have.been.calledOnce;
  });

  it('should set predefined solana configuration with additional property override', function () {
    walletStub.getPluginState.returns(EmptyMetamaskState());
    walletStub.updatePluginState.returnsArg(0);

    const customConfiguration = solanaTestnetConfiguration;
    customConfiguration.rpc.url = 'wss://custom';
    const result = configure(walletStub, 't', {
      rpc: { url: 'wss://custom' },
    } as SnapConfig);

    expect(result).to.be.deep.eq(customConfiguration);
    expect(walletStub.updatePluginState).to.have.been.calledOnceWithExactly({
      solana: {
        config: customConfiguration,
        transactions: [],
      },
    });
    expect(walletStub.updatePluginState).to.have.been.calledOnce;
  });
});
