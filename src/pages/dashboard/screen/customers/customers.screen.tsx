import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CustomersList from './customers.list';
import { Divider, Stack, useTheme} from '@mui/material';
import { useState } from 'react';
import { useSnackbar } from '~/hooks/use-snackbar/use-snackbar';

export default function CustomersScreen() {
  const { palette } = useTheme();
  const { snackbar } = useSnackbar();
  const [refreshKey, setRefreshKey] = useState<number>(0);

  

  return (
    <Stack spacing={2}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h3">Quản lý người dùng</Typography>
        
      </Box>
      <Divider sx={{ color: palette.divider }} />

      <CustomersList key={refreshKey} />

    </Stack>
  );
}
