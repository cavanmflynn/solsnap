import React, { useCallback, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Grid,
  InputAdornment,
  Snackbar,
  TextField,
} from '@material-ui/core/';
import { Alert } from '@material-ui/lab';
import { PublicKey, SystemProgram, Transaction } from '@solana/web3.js';
import { SolanaSnapApi } from '@solana-tools/solsnap-types';
import BigNumber from 'bignumber.js';
import { LAMPORTS_PER_SOL } from '../../constants';

interface ITransferProps {
  network: string;
  api: SolanaSnapApi | null;
  onNewTransactionCallback: any;
}

type AlertSeverity = 'success' | 'warning' | 'info' | 'error';

export const Transfer: React.FC<ITransferProps> = ({ api, onNewTransactionCallback }) => {
  const [recipient, setRecipient] = useState<string>('');
  const [amount, setAmount] = useState<string | number>('');

  const [alert, setAlert] = useState(false);
  const [severity, setSeverity] = useState('success' as AlertSeverity);
  const [message, setMessage] = useState('');

  const handleRecipientChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setRecipient(event.target.value);
    },
    [setRecipient],
  );

  const handleAmountChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setAmount(event.target.value);
    },
    [setAmount],
  );

  const showAlert = (severity: AlertSeverity, message: string) => {
    setSeverity(severity);
    setMessage(message);
    setAlert(true);
  };

  const onSubmit = useCallback(async () => {
    if (amount && recipient && api) {
      const recentBlockhash = await api.getRecentBlockhash();
      const fromPubkey = new PublicKey(await api.getAddress());
      const transaction = new Transaction({ recentBlockhash }).add(
        SystemProgram.transfer({
          fromPubkey,
          toPubkey: new PublicKey(recipient),
          lamports: new BigNumber(amount).times(LAMPORTS_PER_SOL).toNumber(),
        }),
      );
      transaction.setSigners(fromPubkey);
      const signedTransaction = await api.signTransaction(
        transaction.serialize({ requireAllSignatures: false, verifySignatures: false }).toString('base64'),
      );
      showAlert('info', `Signed Transaction: ${signedTransaction}`);
      const txResult = await api.sendTransaction(signedTransaction);
      showAlert('info', `Transaction sent with signature: ${txResult.signature}`);
      // Clear form
      setAmount('');
      setRecipient('');
      // Inform to refresh transactions display
      onNewTransactionCallback();
    }
  }, [amount, recipient, api, onNewTransactionCallback]);

  return (
    <Card>
      <CardContent>
        <CardHeader title="Transfer" />
        <Grid container alignItems="center" justify="space-between">
          <Grid item xs={12}>
            <TextField
              onChange={handleRecipientChange}
              size="medium"
              fullWidth
              id="recipient"
              label="Recipient"
              variant="outlined"
              value={recipient}
            ></TextField>
            <Box m="0.5rem" />
            <TextField
              InputProps={{ startAdornment: <InputAdornment position="start">SOL</InputAdornment> }}
              onChange={handleAmountChange}
              size="medium"
              fullWidth
              id="amount"
              label="Amount"
              variant="outlined"
              value={amount}
            ></TextField>
          </Grid>
        </Grid>
        <Box m="0.5rem" />
        <Grid container item xs={12} justify="flex-end">
          <Button onClick={onSubmit} color="secondary" variant="contained" size="large">
            SEND
          </Button>
        </Grid>
        <Snackbar
          open={alert}
          autoHideDuration={6000}
          onClose={() => setAlert(false)}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
        >
          <Alert severity={severity} onClose={() => setAlert(false)}>
            {`${message} `}
          </Alert>
        </Snackbar>
      </CardContent>
    </Card>
  );
};
