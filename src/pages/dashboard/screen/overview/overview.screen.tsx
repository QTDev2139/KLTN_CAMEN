import React, { useState } from 'react';
import { Typography, Stack, Divider, useTheme, Button, Menu, MenuItem, TextField, Box } from '@mui/material';
import { FileDownload, FilterList, Check } from '@mui/icons-material';
import { ListOverview } from './overview.list';
import { StackRow, StackRowJustBetween } from '~/components/elements/styles/stack.style';

type FilterType = 'day' | 'week' | 'month' | 'year' | 'custom';

export interface OverviewFilterProps {
  filterType: FilterType;
  startDate?: string;
  endDate?: string;
}

const OverviewScreen: React.FC = () => {
  const { palette } = useTheme();
  
  // Temporary filter states (not applied yet)
  const [tempFilterType, setTempFilterType] = useState<FilterType>('month');
  const [tempStartDate, setTempStartDate] = useState('');
  const [tempEndDate, setTempEndDate] = useState('');
  
  // Applied filter states (triggers API call)
  const [appliedFilter, setAppliedFilter] = useState<OverviewFilterProps>({
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

  const handleExportExcel = () => {
    const data = [
      ['Bộ lọc', `${getFilterLabel()}${showCustomDate ? ` (${tempStartDate} đến ${tempEndDate})` : ''}`],
      ['Doanh số Năm hiện tại', '$488,008,011'],
      ['Doanh thu đã thanh toán', '$491,063,233'],
      ['Chưa thanh toán', '$491,063'],
      ['Tổng đơn hàng', '100'],
      ['Đơn hàng chờ xử lý', '12'],
    ];

    const csv = data.map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `thong-ke-san-pham-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
      <StackRowJustBetween>
        <Typography variant="h4" sx={{ mb: 2 }}>
          Thống kê sản phẩm
        </Typography>
        
        <StackRow sx={{ gap: 1.5 }}>
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

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleFilterClose}
          >
            <MenuItem 
              onClick={() => handleFilterSelect('day')}
              selected={tempFilterType === 'day'}
            >
              Ngày hôm nay
            </MenuItem>
            <MenuItem 
              onClick={() => handleFilterSelect('week')}
              selected={tempFilterType === 'week'}
            >
              Tuần này
            </MenuItem>
            <MenuItem 
              onClick={() => handleFilterSelect('month')}
              selected={tempFilterType === 'month'}
            >
              Tháng này
            </MenuItem>
            <MenuItem 
              onClick={() => handleFilterSelect('year')}
              selected={tempFilterType === 'year'}
            >
              Năm này
            </MenuItem>
            <MenuItem 
              onClick={() => handleFilterSelect('custom')}
              selected={tempFilterType === 'custom'}
            >
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

          {/* Export Button */}
          <Button
            variant="contained"
            startIcon={<FileDownload />}
            onClick={handleExportExcel}
            sx={{
              textTransform: 'none',
              bgcolor: 'success.main',
              '&:hover': {
                bgcolor: 'success.dark',
              },
            }}
          >
            Xuất Excel
          </Button>
        </StackRow>
      </StackRowJustBetween>
      <Divider sx={{ color: palette.divider }} />

      <ListOverview filter={appliedFilter} />
    </Stack>
  );
};

export default OverviewScreen;
