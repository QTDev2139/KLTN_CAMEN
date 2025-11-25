import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import React from 'react';

interface Column {
  id: string;
  label: string;
  width?: string | number; // <-- added
}

interface TableElementProps<T> {
  title?: string;
  columns: Column[];
  rows: T[];
  renderRow: (row: T, index: number) => React.ReactNode;
}

export default function TableElement<T>({ title, columns, rows, renderRow }: TableElementProps<T>) {
  return (
    <React.Fragment>
      {title && (
        <Typography variant="h6" sx={{ padding: 1 }}>
          {title}
        </Typography>
      )}
      <TableContainer component={Paper} sx={{ maxWidth: '100%', overflowX: 'auto' }}>
        <Table sx={{ minWidth: 650, width: '100%' }} aria-label="simple table">

          <TableHead sx={{ backgroundColor: 'background.paper', border: '1px solid #eee', borderColor: 'divider' }}>
            <TableRow>
              {columns.map((col) => {
                if (col.id === 'action') {
                  return (
                    <TableCell
                      key={col.id}
                      sx={{
                        p: 1,
                        position: 'sticky',
                        right: 0,
                        backgroundColor: 'background.paper',
                        
                      }}
                    >
                      <Typography variant="h6" sx={{ textAlign: 'center', minWidth: col.width, width: '100%' }}>
                        {col.label}
                      </Typography>
                    </TableCell>
                  );
                }
                return (
                  <TableCell key={col.id} >
                    <Typography variant="h6" sx={{ p: 1, textAlign: 'center', width: col.width }}>
                      {col.label}
                    </Typography>
                  </TableCell>
                );
              })}
            </TableRow>
          </TableHead>

          <TableBody sx={{ backgroundColor: 'background.default', border: '1px solid #eee', borderColor: 'divider' }}>
            {rows.map(renderRow)}
          </TableBody>
        </Table>
      </TableContainer>
    </React.Fragment>
  );
}
