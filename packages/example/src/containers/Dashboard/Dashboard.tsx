import React, { useCallback, useContext, useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Container,
  Grid,
  Hidden,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from '@material-ui/core/';
import { MetaMaskConnector } from '../MetaMaskConnector/MetaMaskConnector';
import { MetaMaskContext } from '../../context/metamask';
import { Account } from '../../components/Account/Account';
import { SolanaSnapApi, TransactionStatus } from '@solana-tools/solsnap-types';
import { TransactionTable } from '../../components/TransactionTable/TransactionTable';
import { SignTransaction } from '../../components/SignTransaction/SignTransaction';
import { Transfer } from '../../components/Transfer/Transfer';
import Footer from '../../Footer';

export const Dashboard = () => {
  const [state] = useContext(MetaMaskContext);

  const [balance, setBalance] = useState('');
  const [address, setAddress] = useState('');
  const [transactions, setTransactions] = useState<TransactionStatus[]>([]);

  const [balanceChange, setBalanceChange] = useState<boolean>(false);

  const [network, setNetwork] = useState<'s' | 't'>('s');

  const [api, setApi] = useState<SolanaSnapApi | null>(null);

  const handleNetworkChange = async (event: React.ChangeEvent<{ value: any }>) => {
    const selectedNetwork = event.target.value as 's' | 't';
    if (selectedNetwork === network) return;
    if (api) {
      await api.configure({ network: selectedNetwork });
      setNetwork(selectedNetwork);
      setTransactions(await api.getTransactions());
    }
  };

  const handleNewTransaction = useCallback(async () => {
    if (api) {
      setTransactions(await api.getTransactions());
    }
  }, [api, setTransactions]);

  useEffect(() => {
    (async () => {
      if (state.solanaSnap.isInstalled && state.solanaSnap.snap) {
        const solanaApi = await state.solanaSnap.snap.getSolanaSnapApi();
        setApi(solanaApi);
      }
    })();
  }, [state.solanaSnap.isInstalled, state.solanaSnap.snap]);

  useEffect(() => {
    (async () => {
      if (api) {
        setAddress(await api.getAddress());
        setBalance(await api.getBalance());
        setTransactions(await api.getTransactions());
        console.log(await api.getTransactions());
      }
    })();
  }, [api, network]);

  useEffect(() => {
    // periodically check balance
    const interval = setInterval(async () => {
      if (api) {
        const newBalance = await api.getBalance();
        if (newBalance !== balance) {
          setBalanceChange(true);
          setBalance(newBalance);
        } else {
          setBalanceChange(false);
        }
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [api, balance, setBalance, setBalanceChange]);

  return (
    <Container maxWidth="lg">
      <Grid direction="column" alignItems="center" justify="center" container spacing={3}>
        <Box m="2rem" style={{ textAlign: 'center' }}>
          <Typography variant="h2">Solsnap Demo</Typography>
          <Typography style={{ color: 'gray' }} variant="h6">
            Solsnap enables Solana network inside Metamask.
          </Typography>
        </Box>
        <Hidden xsUp={state.solanaSnap.isInstalled}>
          <MetaMaskConnector />
          <Footer />
        </Hidden>
        <Hidden xsUp={!state.solanaSnap.isInstalled}>
          <Box m="1rem" alignSelf="baseline">
            <InputLabel>Network</InputLabel>
            <Select defaultValue={'s'} onChange={handleNetworkChange}>
              <MenuItem value={'t'}>Testnet</MenuItem>
              <MenuItem value={'s'}>Mainnet</MenuItem>
            </Select>
          </Box>
          <Grid container spacing={3} alignItems="stretch">
            <Grid item xs={12}>
              <Account address={address} balance={`${balance} SOL`} api={api} balanceChange={balanceChange} />
            </Grid>
          </Grid>
          <Box m="1rem" />
          <Grid container spacing={3} alignItems="stretch">
            <Grid item md={6} xs={12}>
              <Transfer api={api} network={network} onNewTransactionCallback={handleNewTransaction} />
            </Grid>
            <Grid item md={6} xs={12}>
              <SignTransaction api={api} />
            </Grid>
          </Grid>
          <Box m="1rem" />
          <Grid container spacing={3} alignItems={'stretch'}>
            <Grid item xs={12}>
              <Card>
                <CardHeader title="Account Transactions" />
                <CardContent>
                  <TransactionTable txs={transactions} />
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Hidden>
      </Grid>
    </Container>
  );
};
