import { ShoppingCart, AttachMoney, PendingActions } from '@mui/icons-material';
import { Box, Paper, Typography, Stack, useTheme, CircularProgress } from '@mui/material';
import {
  ResponsiveContainer,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  Cell,
  PieChart,
  Pie,
  ComposedChart,
} from 'recharts';
import { KPICard } from './kpi-card';
import { OverviewFilterProps } from './overview.screen';
import { useEffect, useMemo, useState, useCallback } from 'react';
import { getDateRange } from '~/common/until/date-format.until';
import { statisticsApi } from '~/apis';

const COLORS = ['#1976d2', '#ed6c02', '#9c27b0', '#2e7d32', '#d32f2f', '#0288d1', '#7b1fa2', '#f57c00'];

interface KPIData {
  value: number;
  comparison: number;
  comparisonText: string;
  previousRange?: {
    startDate: string;
    endDate: string;
  };
}

interface StatisticsData {
  current_year_sales: KPIData;
  paid_revenue: KPIData;
  unpaid_revenue: KPIData;
  total_orders: KPIData;
  pending_orders: KPIData;
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(value);
};

// Format comparison percentage
const formatComparison = (value: number | undefined) => {
  if (value === undefined || value === null) return '0.0';
  return value.toFixed(1);
};

// Reusable ChartCard component
const ChartCard: React.FC<{
  title: string;
  children: React.ReactNode;
  height?: number;
  subtitle?: string;
}> = ({ title, children, height = 300, subtitle }) => {
  const theme = useTheme();
  return (
    <Paper
      sx={{
        p: 2,
        borderRadius: 2,
        boxShadow: 1,
        bgcolor: theme.palette.background.paper,
      }}
    >
      <Box>
        <Typography variant="h6" sx={{ mb: 0.5, fontWeight: 600 }}>
          {title}
        </Typography>
        {subtitle && (
          <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 1 }}>
            {subtitle}
          </Typography>
        )}
      </Box>
      <Box
        sx={{
          width: '100%',
          height: height,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {children}
      </Box>
    </Paper>
  );
};

export const ListOverview = ({ 
  filter, 
  onDataChange 
}: { 
  filter: OverviewFilterProps,
  onDataChange?: (stats: any, dashboard: any) => void
}) => {
  const theme = useTheme();
  const [statisticsData, setStatisticsData] = useState<StatisticsData | null>(null);
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Wrap onDataChange with useCallback to prevent dependency changes
  const handleDataChange = useCallback(() => {
    if (statisticsData && dashboardData && onDataChange) {
      onDataChange(statisticsData, dashboardData);
    }
  }, [statisticsData, dashboardData, onDataChange]);

  // Memoize filtered data based on filter type and dashboardData
  const filteredData = useMemo(() => {
    // Fallbacks if dashboardData is not ready
    const fallback = {
      revenueAndOrders: [] as { month: string; paidRevenue: number; totalOrders: number }[],
      topProducts: [] as { name: string; revenue: number; fill?: string }[],
      paymentStatus: [] as { name: string; value: number; fill: string }[],
      orderStatusFunnel: [] as { name: string; value: number; status_key?: string }[],
    };
    if (!dashboardData) return fallback;

    // 1) Pie: payment status
    const paymentStatus =
      dashboardData.donut_chart_payment_status?.labels?.map((label: string, idx: number) => ({
        name: label,
        value: dashboardData.donut_chart_payment_status.values?.[idx] ?? 0,
        fill: dashboardData.donut_chart_payment_status.colors?.[idx] ?? COLORS[idx % COLORS.length],
      })) ?? fallback.paymentStatus;

    // 2) Funnel / order flow
    const orderStatusFunnel =
      dashboardData.funnel_chart_order_flow?.steps?.map((s: any) => ({
        name: s.label,
        value: s.value,
        status_key: s.status_key,
      })) ?? fallback.orderStatusFunnel;

    // 3) Line: monthly trend
    const labels: string[] = dashboardData.line_chart_monthly_trend?.labels ?? [];
    const ds = dashboardData.line_chart_monthly_trend?.datasets ?? [];
    const paidDs = ds.find((d: any) => d.label?.toLowerCase().includes('đã thanh toán'));
    const orderDs = ds.find((d: any) => d.label?.toLowerCase().includes('tổng đơn'));
    const revenueAndOrders =
      labels.length && paidDs && orderDs
        ? labels.map((month, idx) => ({
            month,
            paidRevenue: paidDs.data?.[idx] ?? 0,
            totalOrders: orderDs.data?.[idx] ?? 0,
          }))
        : fallback.revenueAndOrders;

    // 4) Bar: top products
    const bar = dashboardData.bar_chart_top_products;
    const topProducts =
      bar?.labels?.map((label: string, idx: number) => {
        const salesData = bar?.data?.[0];
        const revenueData = bar?.data?.[1];
        return {
          name: label,
          sales: salesData?.values?.[idx] ?? 0,
          revenue: revenueData?.values?.[idx] ?? 0,
        };
      }) ?? fallback.topProducts;

    return { revenueAndOrders, topProducts, paymentStatus, orderStatusFunnel };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dashboardData, filter]);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const dateRange = getDateRange(filter);

        const res = await statisticsApi.getStatisticsOverview({
          startDate: dateRange.startDate,
          endDate: dateRange.endDate,
        });
        const dashRes = await statisticsApi.getStatisticsDashboard({
          startDate: dateRange.startDate,
          endDate: dateRange.endDate,
        });

        setStatisticsData(res.data);
        setDashboardData(dashRes.data);
        
        // Pass data to parent component
        if (onDataChange) {
          onDataChange(res.data, dashRes.data);
        }
      } catch (error) {
        console.error('Error fetching statistics:', error);
      } finally {
        setLoading(false);
      }
    })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  // Call onDataChange after data is loaded
  useEffect(() => {
    handleDataChange();
  }, [handleDataChange]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Stack spacing={3} sx={{ width: '100%' }}>
      {/* KPI Cards */}
      <Stack direction="row" spacing={2} sx={{ mb: 2, flexWrap: 'wrap' }}>
        <Box sx={{ flex: 1, minWidth: 220 }}>
          <KPICard
            label="Tổng doanh thu"
            value={statisticsData ? formatCurrency(statisticsData.current_year_sales.value) : '0 ₫'}
            gradient="linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)"
            icon={<AttachMoney />}
            trend={
              statisticsData?.current_year_sales?.comparison !== undefined
                ? parseFloat(formatComparison(statisticsData.current_year_sales.comparison *100))
                : 0
            }
            trendLabel={"So với kỳ trước"}
          />
        </Box>
        <Box sx={{ flex: 1, minWidth: 220 }}>
          <KPICard
            label="Doanh thu đã thanh toán"
            value={statisticsData ? formatCurrency(statisticsData.paid_revenue.value) : '0 ₫'}
            gradient="linear-gradient(135deg, #2e7d32 0%, #66bb6a 100%)"
            icon={<AttachMoney />}
            trend={
              statisticsData?.paid_revenue?.comparison !== undefined
                ? parseFloat(formatComparison(statisticsData.paid_revenue.comparison *100))
                : 0
            }
            trendLabel={statisticsData?.paid_revenue?.comparisonText}
          />
        </Box>
        <Box sx={{ flex: 1, minWidth: 220 }}>
          <KPICard
            label="Chưa thanh toán"
            value={statisticsData ? formatCurrency(statisticsData.unpaid_revenue.value) : '0 ₫'}
            gradient="linear-gradient(135deg, #f57c00 0%, #ffb74d 100%)"
            icon={<PendingActions />}
            trend={
              statisticsData?.unpaid_revenue?.comparison !== undefined
                ? parseFloat(formatComparison(statisticsData.unpaid_revenue.comparison *100))
                : 0
            }
            trendLabel={"So với kỳ trước"}
          />
        </Box>
        <Box sx={{ flex: 1, minWidth: 220 }}>
          <KPICard
            label="Tổng đơn hàng"
            value={statisticsData?.total_orders?.value?.toString() || '0'}
            gradient="linear-gradient(135deg, #388e3c 0%, #7cb342 100%)"
            icon={<ShoppingCart />}
            trend={
              statisticsData?.total_orders?.comparison !== undefined
                ? parseFloat(formatComparison(statisticsData.total_orders.comparison *100))
                : 0
            }
            trendLabel={"So với kỳ trước"}
          />
        </Box>
        <Box sx={{ flex: 1, minWidth: 220 }}>
          <KPICard
            label="Đơn hàng chờ xử lý"
            value={statisticsData?.pending_orders?.value?.toString() || '0'}
            gradient="linear-gradient(135deg, #d32f2f 0%, #ef5350 100%)"
            icon={<PendingActions />}
            trend={
              statisticsData?.pending_orders?.comparison !== undefined
                ? parseFloat(formatComparison(statisticsData.pending_orders.comparison))
                : 0
            }
            trendLabel={"So với kỳ trước"}
          />
        </Box>
      </Stack>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
          gap: 2,
        }}
      >
        {/* Pie Chart: Cơ cấu Trạng thái Thanh toán */}
        <ChartCard
          title="Trạng thái thanh toán"
          height={350}
          subtitle="Đánh giá rủi ro về doanh thu (mục tiêu: giảm tỷ trọng Chưa thanh toán)"
        >
          <ResponsiveContainer width="100%" height={350}>
            <PieChart margin={{ top: 20, right: 20, left: 20, bottom: 20 }}>
              <Pie
                data={filteredData.paymentStatus}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}%`}
              >
                {filteredData.paymentStatus.map(
                  (entry: { name: string; value: number; fill: string }, index: number) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ),
                )}
              </Pie>
              <Tooltip formatter={(value) => `${value}%`} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Funnel Chart: Luồng Chuyển đổi Trạng thái Đơn hàng */}
        <ChartCard
          title="Trạng thái đơn hàng"
          height={350}
          subtitle="Tìm kiếm nút thắt cổ chai và tối ưu hóa quy trình xử lý đơn hàng"
        >
          <ResponsiveContainer width="100%" height={350}>
            <BarChart
              layout="vertical"
              data={filteredData.orderStatusFunnel}
              margin={{ top: 20, right: 20, left: 120, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={110} tick={{ fontSize: 12 }} />
              <Tooltip formatter={(value: any) => value} />
              <Bar dataKey="value" fill="#1976d2">
                {filteredData.orderStatusFunnel.map(
                  (entry: { name: string; value: number; status_key?: string }, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ),
                )}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </Box>

      {/* 1. Line Chart: Doanh thu và Đơn hàng theo Tháng */}
      <ChartCard
        title="Doanh thu và Đơn hàng theo Tháng"
        height={350}
        subtitle="Phân tích xu hướng và sự tương quan giữa doanh thu đã thanh toán và tổng đơn hàng"
      >
        <ResponsiveContainer width="100%" height={350}>
          <ComposedChart data={filteredData.revenueAndOrders} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
            <XAxis dataKey="month" />
            <YAxis yAxisId="left" label={{ value: 'Doanh thu (VND)', angle: -90, position: 'insideLeft' }} />
            <YAxis
              yAxisId="right"
              orientation="right"
              label={{ value: 'Số đơn hàng', angle: 90, position: 'insideRight' }}
            />
            <Tooltip
              formatter={(value: any, name: string) => {
                if (name === 'Doanh thu đã thanh toán') {
                  return [`${(value / 1000).toFixed(1)}K VND`, name];
                }
                return [value, name];
              }}
            />
            <Legend />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="paidRevenue"
              stroke="#2e7d32"
              strokeWidth={3}
              dot={{ r: 5 }}
              name="Doanh thu đã thanh toán"
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="totalOrders"
              stroke="#1976d2"
              strokeWidth={3}
              dot={{ r: 5 }}
              name="Tổng đơn hàng"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* 2. Horizontal Bar Chart: Top Sản phẩm theo Doanh thu */}
      <ChartCard
        title="Top Sản phẩm theo Doanh thu"
        height={350}
        subtitle="Xác định sản phẩm chủ lực (best-seller) để tập trung nguồn lực (Quy tắc 80/20)"
      >
        <ResponsiveContainer width="100%" height={350}>
          <BarChart
            layout="vertical"
            data={filteredData.topProducts}
            margin={{ top: 5, right: 30, left: 200, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
            <XAxis type="number" />
            <YAxis dataKey="name" type="category" width={190} tick={{ fontSize: 12 }} />
            <Tooltip
              formatter={(value: any, name: string) => {
                if (name === 'Tổng tiền') {
                  return [
                    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value),
                    name,
                  ];
                }
                return [value, name];
              }}
            />
            <Legend />
            <Bar dataKey="sales" fill="#4CAF50" name="Lượt bán" />
            <Bar dataKey="revenue" fill="#2196F3" name="Tổng tiền (VND)" />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* 3 & 4: Two-column layout */}
    </Stack>
  );
};
