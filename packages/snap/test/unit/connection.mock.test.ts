import sinon from 'sinon';
import { Connection } from '@solana/web3.js';

export const createConnectionStub = () => sinon.createStubInstance(Connection);
