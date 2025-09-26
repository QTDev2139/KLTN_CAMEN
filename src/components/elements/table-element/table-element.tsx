import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import React from 'react';

interface Column {
  id: string;
  label: string;
}

interface TableElementProps<T> {
  title?: string;
  columns: Column[];
  rows: T[];
  renderRow: (row: T, index: number) => React.ReactNode; // T -> interface Post
}

export default function TableElement<T>({ title, columns, rows, renderRow }: TableElementProps<T>) {
  return (
    <React.Fragment>
      {title && (
        <Typography variant="h6" sx={{ padding: 1 }}>
          {title}
        </Typography>
      )}
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              {columns.map((col) => (
                <TableCell key={col.id}>
                  <Typography variant="h6" sx={{ textAlign: 'center' }}>{col.label}</Typography>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>{rows.map(renderRow)}</TableBody>
        </Table>
      </TableContainer>
    </React.Fragment>
  );
}
