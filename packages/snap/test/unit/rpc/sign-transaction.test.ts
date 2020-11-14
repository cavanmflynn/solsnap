import { WalletMock } from '../wallet.mock.test';
import chai, { expect } from 'chai';
import sinonChai from 'sinon-chai';
import { testBip44Entropy } from './key-pair-test-constants';
import { SnapConfig } from '@solana-tools/solsnap-types';
import { signTransaction } from '../../../src/rpc/sign-transaction';
import { Account, SystemProgram, Transaction } from '@solana/web3.js';
import { fromBase64, getKeyPair, toBase64 } from '../../../src/solana';
import { Buffer } from 'buffer';
import nacl from 'tweetnacl';

chai.use(sinonChai);

describe('Test rpc handler function: signTransaction', () => {
  const walletStub = new WalletMock();

  let transaction: string;
  beforeEach(async () => {
    walletStub.send.returns(testBip44Entropy);
    walletStub.getPluginState.returns({
      solana: {
        config: {
          network: 's',
          derivationPath: "m/44'/501'/0'/0/0",
        } as SnapConfig,
      },
    });
    const { privateKey } = await getKeyPair(walletStub);
    const keyPair = nacl.sign.keyPair.fromSeed(Buffer.from(privateKey, 'hex'));
    const account1 = new Account(keyPair.secretKey);
    const account2 = new Account();
    const nonceAccount = new Account();

    const nonce = account2.publicKey.toBase58(); // Fake Nonce hash
    const nonceInfo = {
      nonce,
      nonceInstruction: SystemProgram.nonceAdvance({
        noncePubkey: nonceAccount.publicKey,
        authorizedPubkey: account1.publicKey,
      }),
    };

    const tx = new Transaction({ nonceInfo }).add(
      SystemProgram.transfer({
        fromPubkey: account1.publicKey,
        toPubkey: account2.publicKey,
        lamports: 123,
      }),
    );
    tx.setSigners(account1.publicKey);
    transaction = toBase64(tx);
  });

  afterEach(function () {
    walletStub.reset();
  });

  it('should successfully sign valid transaction on positive prompt', async function () {
    walletStub.send.callsFake(async req => {
      if (req.method === 'wallet_getBip44Entropy_501') return testBip44Entropy;
      if (req.method === 'confirm') return true;
      throw new Error('unknown rpc method');
    });

    const signedTransaction = await signTransaction(walletStub, transaction);
    expect(walletStub.send).to.have.been.calledThrice;
    expect(walletStub.getPluginState).to.have.been.calledTwice;
    expect(walletStub.getAppKey).to.have.not.been.called;
    expect(fromBase64(signedTransaction).signature).to.not.be.empty;
  });

  it('should cancel signing on negative prompt', async function () {
    walletStub.send.callsFake(async req => {
      if (req.method === 'wallet_getBip44Entropy_501') return testBip44Entropy;
      if (req.method === 'confirm') return false;
      throw new Error('unknown rpc method');
    });

    const signedTransaction = await signTransaction(walletStub, transaction);
    expect(walletStub.send).to.have.been.calledTwice;
    expect(walletStub.getPluginState).to.have.been.calledOnce;
    expect(walletStub.getAppKey).to.have.not.been.called;
    expect(signedTransaction).to.be.null;
  });

  it('should fail signing on invalid transaction', async function () {
    walletStub.send.onCall(0).returns(true);
    walletStub.send.onCall(1).returns(testBip44Entropy);
    walletStub.getPluginState.returns({
      solana: {
        config: {
          network: 's',
          derivationPath: "m/44'/501'/0'/0/0",
        } as SnapConfig,
      },
    });

    const invalidTransaction = fromBase64(transaction);
    invalidTransaction.instructions = [];

    expect(async () => {
      return signTransaction(walletStub, toBase64(invalidTransaction));
    }).to.throw;
  });
});
