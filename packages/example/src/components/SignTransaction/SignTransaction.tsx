import React, { useState } from 'react';
import {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Dialog,
  Grid,
  TextField,
} from '@material-ui/core';
import { SolanaSnapApi } from '@solana-tools/solsnap-types';
import { Transaction } from '@solana/web3.js';
import toHex from 'to-hex';

export interface SignTransactionProps {
  api: SolanaSnapApi | null;
}

export const SignTransaction = (props: SignTransactionProps) => {
  const [textFieldValue, setTextFieldValue] = useState<string>('');
  const [modalBody, setModalBody] = useState<string>('');
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTextFieldValue(event.target.value);
  };

  const onSubmit = async () => {
    if (textFieldValue && props.api) {
      const rawTransaction = toHex(textFieldValue, { addPrefix: true });
      const transaction = await props.api.signTransaction(rawTransaction);
      setTextFieldValue('');
      setModalBody(Transaction.from(Buffer.from(transaction, 'base64')).signature?.toString('hex')!);
      setModalOpen(true);
    }
  };

  return (
    <Card style={{ height: '100%' }}>
      <CardHeader title="Sign Base64 Encoded Transaction" />
      <CardContent>
        <Grid container>
          <TextField
            onChange={handleChange}
            value={textFieldValue}
            size="medium"
            fullWidth
            id="custom-transaction"
            label="Transaction"
            variant="outlined"
          />
        </Grid>
        <Box m="0.5rem" />
        <Grid container justify="flex-end">
          <Button onClick={onSubmit} color="secondary" variant="contained" size="large">
            Sign
          </Button>
        </Grid>
      </CardContent>
      <Dialog
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{'Transaction signature'}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            This is signature of your transaction:
            <br />
            <Typography style={{ wordWrap: 'break-word' }}>{modalBody}</Typography>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setModalOpen(false)} color="primary" autoFocus>
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};
