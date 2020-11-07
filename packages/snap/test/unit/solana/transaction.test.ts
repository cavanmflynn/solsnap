import chai, { expect } from 'chai';
import sinonChai from 'sinon-chai';
import { WalletMock } from '../wallet.mock.test';
import { updateTransactionInState } from '../../../src/solana';
import { Account, SystemProgram, Transaction } from '@solana/web3.js';

chai.use(sinonChai);

describe('Test saving transactions in state', function () {
  const walletStub = new WalletMock();
  const account = new Account();
  const nonce = account.publicKey.toBase58(); // Fake Nonce hash
  const transaction = {
    transaction: new Transaction({
      nonceInfo: {
        nonce,
        nonceInstruction: SystemProgram.nonceAdvance({
          noncePubkey: account.publicKey,
          authorizedPubkey: account.publicKey,
        }),
      },
    }),
    signature: 'abc',
  };

  afterEach(function () {
    walletStub.reset();
  });

  it('should add transaction to state if empty state', function () {
    walletStub.getPluginState.returns({
      solana: { config: { network: 's' }, transactions: [] },
    });
    walletStub.updatePluginState.returnsArg(0);

    updateTransactionInState(walletStub, transaction);

    expect(walletStub.getPluginState).to.have.been.calledOnce;
    expect(walletStub.updatePluginState).to.have.been.calledOnceWith({
      solana: { config: { network: 's' }, transactions: [transaction] },
    });
  });

  it('should add transaction to state if same hash transaction is not saved', function () {
    const differentTx = { ...transaction, signature: '123' };

    walletStub.getPluginState.returns({
      solana: { config: { network: 's' }, transactions: [differentTx] },
    });
    walletStub.updatePluginState.returnsArg(0);

    updateTransactionInState(walletStub, transaction);

    expect(walletStub.getPluginState).to.have.been.calledOnce;
    expect(walletStub.updatePluginState).to.have.been.calledOnceWith({
      solana: { config: { network: 's' }, transactions: [differentTx, transaction] },
    });
  });

  it('should update transaction if same hash transaction already in state', function () {
    walletStub.getPluginState.returns({
      solana: { config: { network: 's' }, transactions: [transaction] },
    });
    walletStub.updatePluginState.returnsArg(0);

    const updatedTx = { ...transaction };
    updatedTx.transaction.nonceInfo.nonce = 'fake_nonce_hash';

    updateTransactionInState(walletStub, updatedTx);

    expect(walletStub.getPluginState).to.have.been.calledOnce;
    expect(walletStub.updatePluginState).to.have.been.calledOnceWith({
      solana: { config: { network: 's' }, transactions: [updatedTx] },
    });
  });
});
