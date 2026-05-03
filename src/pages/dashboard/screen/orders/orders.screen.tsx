import { Button, Divider, Stack, Typography, useTheme, TextField, Select, MenuItem, Menu, Box } from "@mui/material";
import { StackRowAlignCenter, StackRow } from "~/components/elements/styles/stack.style";
import { OrderMode } from "./order.enum";
import { useState } from "react";
import ListOrder from "./view/order-list";
import CreateOrder from "./view/order-create";
import SearchIcon from '@mui/icons-material/Search';
import { FilterList, Check } from '@mui/icons-material';

type FilterType = 'day' | 'week' | 'month' | 'year' | 'custom';

export interface OrderFilterProps {
  filterType: FilterType;
  startDate?: string;
  endDate?: string;
}

const OrderScreen: React.FC = () => {
  const { palette } = useTheme();
  const [mode, setMode] = useState<OrderMode>(OrderMode.LIST);
  const [searchCode, setSearchCode] = useState('');
  const [paymentType, setPaymentType] = useState('');

  // Temporary filter states (not applied yet)
  const [tempFilterType, setTempFilterType] = useState<FilterType>('month');
  const [tempStartDate, setTempStartDate] = useState('');
  const [tempEndDate, setTempEndDate] = useState('');

  // Applied filter states (triggers API call)
  const [appliedFilter, setAppliedFilter] = useState<OrderFilterProps>({
    filterType: 'month',
  });

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [showCustomDate, setShowCustomDate] = useState(false);

  const handleFilterClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleFilterClose = () => {
    setAnchorEl(null);
  };

  const handleFilterSelect = (type: FilterType) => {
    setTempFilterType(type);
    if (type !== 'custom') {
      setShowCustomDate(false);
      setTempStartDate('');
      setTempEndDate('');
      // Auto-apply for non-custom filters
      setAppliedFilter({ filterType: type });
    } else {
      setShowCustomDate(true);
    }
    handleFilterClose();
  };

  const handleApplyCustomFilter = () => {
    setAppliedFilter({
      filterType: tempFilterType,
      ...(tempStartDate && { startDate: tempStartDate }),
      ...(tempEndDate && { endDate: tempEndDate }),
    });
  };

  const getFilterLabel = () => {
    const labels: Record<FilterType, string> = {
      day: 'Ngày hôm nay',
      week: 'Tuần này',
      month: 'Tháng này',
      year: 'Năm này',
      custom: 'Tùy chỉnh',
    };
    return labels[tempFilterType];
  };

  return (
    <Stack spacing={2}>
      <StackRowAlignCenter sx={{ justifyContent: 'space-between' }}>
        <Typography variant="h3">Quản lý đơn hàng</Typography>
        <StackRow sx={{ gap: 1.5, alignItems: 'center' }}>
          <TextField
            placeholder="Mã đơn hàng..."
            size="small"
            variant="outlined"
            value={searchCode}
            onChange={(e) => setSearchCode(e.target.value)}
            sx={{ width: 200 }}
            InputProps={{
              startAdornment: <SearchIcon sx={{ mr: 1, color: 'action.active' }} />,
            }}
          />
          <Select
            size="small"
            displayEmpty
            sx={{ width: 180 }}
            value={paymentType}
            onChange={(e) => setPaymentType(e.target.value)}
          >
            <MenuItem value="">Loại thanh toán</MenuItem>
            <MenuItem value="cod">Tiền mặt (COD)</MenuItem>
            <MenuItem value="vnpay">Chuyển khoản</MenuItem>
          </Select>

          {/* Filter Button */}
          <Button
            variant="outlined"
            startIcon={<FilterList />}
            onClick={handleFilterClick}
            sx={{
              textTransform: 'none',
              borderColor: palette.divider,
              color: 'text.primary',
              '&:hover': {
                borderColor: 'primary.main',
                bgcolor: 'action.hover',
              },
            }}
          >
            {getFilterLabel()}
          </Button>

          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleFilterClose}>
            <MenuItem onClick={() => handleFilterSelect('day')} selected={tempFilterType === 'day'}>
              Ngày hôm nay
            </MenuItem>
            <MenuItem onClick={() => handleFilterSelect('week')} selected={tempFilterType === 'week'}>
              Tuần này
            </MenuItem>
            <MenuItem onClick={() => handleFilterSelect('month')} selected={tempFilterType === 'month'}>
              Tháng này
            </MenuItem>
            <MenuItem onClick={() => handleFilterSelect('year')} selected={tempFilterType === 'year'}>
              Năm này
            </MenuItem>
            <MenuItem onClick={() => handleFilterSelect('custom')} selected={tempFilterType === 'custom'}>
              Tùy chỉnh
            </MenuItem>
          </Menu>

          {/* Custom Date Range */}
          {showCustomDate && (
            <>
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                <TextField
                  type="date"
                  size="small"
                  value={tempStartDate}
                  onChange={(e) => setTempStartDate(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  sx={{ width: 150 }}
                />
                <Typography sx={{ color: 'text.secondary' }}>đến</Typography>
                <TextField
                  type="date"
                  size="small"
                  value={tempEndDate}
                  onChange={(e) => setTempEndDate(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  sx={{ width: 150 }}
                />
              </Box>

              {/* Apply Button for Custom Date */}
              <Button
                variant="contained"
                startIcon={<Check />}
                onClick={handleApplyCustomFilter}
                disabled={!tempStartDate && !tempEndDate}
                sx={{
                  textTransform: 'none',
                  bgcolor: 'primary.main',
                  '&:hover': {
                    bgcolor: 'primary.dark',
                  },
                }}
              >
                Áp dụng
              </Button>
            </>
          )}
        </StackRow>
      </StackRowAlignCenter>
      <Divider sx={{ color: palette.divider }} />
      
      {mode === OrderMode.LIST && <ListOrder filter={appliedFilter} searchCode={searchCode} paymentType={paymentType} />}
      {mode === OrderMode.CREATE && <CreateOrder />}
    </Stack>
  );
}

export default OrderScreen;