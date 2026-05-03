import React, { useState } from 'react';
import { Divider, Paper, Stack, Typography, useTheme, FormGroup, FormControlLabel, Checkbox, Popover, Button, Box } from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import ContactList from './contact.list';
import { StackRowAlignCenter } from '~/components/elements/styles/stack.style';
import { StateLabelContact } from './contact.status';

const ContactScreen: React.FC = () => {
  const { palette } = useTheme();
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleFilterClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleFilterClose = () => {
    setAnchorEl(null);
  };

  const handleServiceToggle = (service: string) => {
    setSelectedServices((prev) =>
      prev.includes(service) ? prev.filter((s) => s !== service) : [...prev, service]
    );
  };

  const handleClearServices = () => {
    setSelectedServices([]);
  };

  const open = Boolean(anchorEl);

  // Get all service keys from StateLabelContact
  const serviceKeys = Object.keys(StateLabelContact);

  return (
    <Stack spacing={2}>
      <StackRowAlignCenter sx={{ justifyContent: 'space-between' }}>
        <Typography variant="h3">Quản lý liên hệ</Typography>
        <Button
          variant={selectedServices.length > 0 ? 'contained' : 'outlined'}
          startIcon={<FilterListIcon />}
          onClick={handleFilterClick}
          sx={{
            textTransform: 'none',
          }}
        >
          Dịch vụ {selectedServices.length > 0 ? `(${selectedServices.length})` : ''}
        </Button>
      </StackRowAlignCenter>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleFilterClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <Box sx={{ p: 2, minWidth: 250 }}>
          <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
            Lọc theo dịch vụ
          </Typography>
          <FormGroup>
            {serviceKeys.map((serviceKey) => (
              <FormControlLabel
                key={serviceKey}
                control={
                  <Checkbox
                    checked={selectedServices.includes(serviceKey)}
                    onChange={() => handleServiceToggle(serviceKey)}
                  />
                }
                label={
                  <Typography variant="body2">
                    {StateLabelContact[serviceKey]}
                  </Typography>
                }
              />
            ))}
          </FormGroup>
          {selectedServices.length > 0 && (
            <Button
              fullWidth
              variant="text"
              size="small"
              onClick={handleClearServices}
              sx={{ mt: 2 }}
            >
              Xóa bộ lọc
            </Button>
          )}
        </Box>
      </Popover>

      <Divider sx={{ color: palette.divider }} />

      <Paper sx={{ p: 2 }}>
        <ContactList selectedServices={selectedServices} />
      </Paper>
    </Stack>
  );
};

export default ContactScreen;