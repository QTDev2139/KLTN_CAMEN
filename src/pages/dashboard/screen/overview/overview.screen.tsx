import React, { useState, useCallback } from 'react';
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
  const [statisticsData, setStatisticsData] = useState<any>(null);
  const [dashboardData, setDashboardData] = useState<any>(null);

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
    if (!statisticsData || !dashboardData) {
      alert('Dữ liệu chưa được tải. Vui lòng thử lại.');
      return;
    }

    const filterLabel = getFilterLabel();
    const dateRange = showCustomDate ? `(${tempStartDate} đến ${tempEndDate})` : '';

    // Prepare data for export
    const data: string[][] = [];

    // Header
    data.push(['THỐNG KÊ DASHBOARD']);
    data.push(['Bộ lọc', `${filterLabel} ${dateRange}`]);
    data.push(['']);

    // KPI Cards Data
    data.push(['KPI METRICS']);
    data.push(['Chỉ tiêu', 'Giá trị', 'So sánh (%)']);
    data.push([
      'Tổng doanh thu',
      formatCurrency(statisticsData?.current_year_sales?.value || 0),
      `${formatComparison(statisticsData?.current_year_sales?.comparison * 100)}%`,
    ]);
    data.push([
      'Doanh thu đã thanh toán',
      formatCurrency(statisticsData?.paid_revenue?.value || 0),
      `${formatComparison(statisticsData?.paid_revenue?.comparison * 100)}%`,
    ]);
    data.push([
      'Chưa thanh toán',
      formatCurrency(statisticsData?.unpaid_revenue?.value || 0),
      `${formatComparison(statisticsData?.unpaid_revenue?.comparison * 100)}%`,
    ]);
    data.push([
      'Tổng đơn hàng',
      statisticsData?.total_orders?.value?.toString() || '0',
      `${formatComparison(statisticsData?.total_orders?.comparison * 100)}%`,
    ]);
    data.push([
      'Đơn hàng chờ xử lý',
      statisticsData?.pending_orders?.value?.toString() || '0',
      `${formatComparison(statisticsData?.pending_orders?.comparison * 100)}%`,
    ]);
    data.push(['']);

    // Payment Status Data
    data.push(['CƠ CẤU TRẠNG THÁI THANH TOÁN']);
    data.push(['Trạng thái', 'Tỷ lệ (%)']);
    const paymentStatus = dashboardData?.donut_chart_payment_status;
    if (paymentStatus?.labels) {
      paymentStatus.labels.forEach((label: string, idx: number) => {
        data.push([label, paymentStatus.values?.[idx]?.toString() || '0']);
      });
    }
    data.push(['']);

    // Order Status Funnel Data
    data.push(['TRẠNG THÁI ĐƠN HÀNG']);
    data.push(['Trạng thái', 'Số lượng']);
    const funnel = dashboardData?.funnel_chart_order_flow;
    if (funnel?.steps) {
      funnel.steps.forEach((step: any) => {
        data.push([step.label, step.value?.toString() || '0']);
      });
    }
    data.push(['']);

    // Monthly Trend Data
    data.push(['DOANH THU VÀ ĐƠN HÀNG THEO THÁNG']);
    data.push(['Tháng', 'Doanh thu đã thanh toán (VND)', 'Tổng đơn hàng']);
    const monthlyTrend = dashboardData?.line_chart_monthly_trend;
    if (monthlyTrend?.labels) {
      monthlyTrend.labels.forEach((month: string, idx: number) => {
        const paidRevenue = monthlyTrend.datasets
          ?.find((d: any) => d.label?.toLowerCase().includes('đã thanh toán'))
          ?.data?.[idx] || 0;
        const totalOrders = monthlyTrend.datasets
          ?.find((d: any) => d.label?.toLowerCase().includes('tổng đơn'))
          ?.data?.[idx] || 0;
        data.push([month, paidRevenue.toString(), totalOrders.toString()]);
      });
    }
    data.push(['']);

    // Top Products Data
    data.push(['TOP SẢN PHẨM THEO DOANH THU']);
    data.push(['Sản phẩm', 'Lượt bán', 'Doanh thu (VND)']);
    const barData = dashboardData?.bar_chart_top_products;
    if (barData?.labels) {
      barData.labels.forEach((label: string, idx: number) => {
        const sales = barData.data?.[0]?.values?.[idx] || 0;
        const revenue = barData.data?.[1]?.values?.[idx] || 0;
        data.push([label, sales.toString(), revenue.toString()]);
      });
    }

    // Create CSV
    const csv = data.map((row) => row.map((cell) => `"${cell}"`).join(',')).join('\n');
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute(
      'download',
      `thong-ke-dashboard-${new Date().toISOString().split('T')[0]}.csv`
    );
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(value);
  };

  const formatComparison = (value: number | undefined) => {
    if (value === undefined || value === null) return '0.0';
    return value.toFixed(1);
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

  // Wrap onDataChange with useCallback
  const handleDataChange = useCallback((stats: any, dashboard: any) => {
    setStatisticsData(stats);
    setDashboardData(dashboard);
  }, []);

  return (
    <Stack spacing={2}>
      <StackRowJustBetween>
        <Typography variant="h4">Thống kê sản phẩm</Typography>

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

      <ListOverview
        filter={appliedFilter}
        onDataChange={handleDataChange}
      />
    </Stack>
  );
};

export default OverviewScreen;
