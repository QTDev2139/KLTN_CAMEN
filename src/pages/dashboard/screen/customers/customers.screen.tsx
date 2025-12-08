import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CustomersList from './customers.list';
import { Divider, Stack, TextField, useTheme } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useState } from 'react';
import { StackRowJustBetween } from '~/components/elements/styles/stack.style';

export default function CustomersScreen() {
  const { palette } = useTheme();
  const [refreshKey, setRefreshKey] = useState<number>(0);
  const [searchEmail, setSearchEmail] = useState<string>('');

  return (
    <Stack spacing={2}>
      <StackRowJustBetween>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <Typography variant="h3">Quản lý người dùng</Typography>
        </Box>
        <TextField
          placeholder="Tìm kiếm theo email..."
          size="small"
          variant="outlined"
          value={searchEmail}
          onChange={(e) => setSearchEmail(e.target.value)}
          sx={{ minWidth: 250 }}
          InputProps={{
            startAdornment: <SearchIcon sx={{ mr: 1, color: 'action.active' }} />,
          }}
        />
      </StackRowJustBetween>
      <Divider sx={{ color: palette.divider }} />
      <CustomersList key={refreshKey} /> {/** searchEmail={searchEmail} */}
    </Stack>
  );
}
