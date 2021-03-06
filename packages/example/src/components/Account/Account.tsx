import React from 'react';
import { Box, Button, Card, CardContent, CardHeader, Divider, Grid, Typography } from '@material-ui/core';
import { SolanaSnapApi } from '@solana-tools/solsnap-types';

export interface AccountProps {
  address: string;
  balance: string;
  balanceChange: boolean;
  api: SolanaSnapApi | null;
}

export const Account = (props: AccountProps) => {
  const handleExport = async () => {
    if (props.api) {
      const privateKey = await props.api.exportPrivateKey();
      alert(`Your private key: ${privateKey}`);
    }
  };

  return (
    <Card>
      <CardHeader title="Account Details" />
      <CardContent>
        <Grid container alignItems="center">
          <Grid item md={6} xs={12}>
            <Typography variant="h6">Address:</Typography>
            <Typography variant="subtitle2">{props.address}</Typography>
            <Divider light />
            <Box m={'0.5rem'} />
            <Typography variant="h6">Account Balance:</Typography>
            {props.balanceChange ? (
              <Typography variant="subtitle2">
                <b>{props.balance}</b>
              </Typography>
            ) : (
              <Typography variant="subtitle2">{props.balance}</Typography>
            )}
          </Grid>
        </Grid>
        <Grid container item xs={12} justify="flex-end">
          <Button color="secondary" variant={'contained'} onClick={handleExport}>
            Export private key
          </Button>
        </Grid>
      </CardContent>
    </Card>
  );
};
