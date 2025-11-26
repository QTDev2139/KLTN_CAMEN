import React from 'react';
import { Divider, Paper, Stack, Typography, useTheme } from '@mui/material';
import ContactList from './contact.list';

const ContactScreen: React.FC = () => {
    const { palette } = useTheme();
  return (
    <Stack spacing={2}>
      <Typography variant="h3" gutterBottom>Quản lý liên hệ</Typography>
      <Divider sx={{ color: palette.divider }} />
      <Paper sx={{ p: 2 }}>
        <ContactList />
      </Paper>
    </Stack>
  );
};

export default ContactScreen;