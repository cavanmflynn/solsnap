import React from 'react';
import { Paper, Table, TableContainer, TableCell, TableRow, TableHead, TableBody } from '@material-ui/core/';
import { TransactionStatus } from '@solana-tools/solsnap-types';

export interface TransactionTableProps {
  txs: TransactionStatus[];
}

export const TransactionTable = (props: TransactionTableProps) => {
  return (
    <TableContainer className="transtaction-table" component={Paper}>
      <Table aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Transaction Signature</TableCell>
            <TableCell align="center">Recent Blockhash</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {props.txs.map(tx => (
            <TableRow key={tx.signature}>
              <TableCell align="left" component="th" scope="row">
                {tx.signature}
              </TableCell>
              <TableCell align="center">{tx.transaction.recentBlockhash}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
