import { TrendingDown, TrendingUp } from "@mui/icons-material";
import { Box, Paper, Typography } from "@mui/material";

export const KPICard: React.FC<{
  label: string;
  value: string | number;
  gradient: string;
  icon?: React.ReactNode;
  subtitle?: string;
  trend?: number;
  trendLabel?: string;
}> = ({ label, value, gradient, icon, subtitle, trend, trendLabel }) => (
  <Paper
    sx={{
      p: 2,
      borderRadius: 2,
      background: gradient,
      color: 'white',
      boxShadow: 2,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      minHeight: 120,
      transition: 'transform 0.3s ease, boxShadow 0.3s ease',
      '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: 4,
      },
    }}
  >
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <Box>
        <Typography variant="body2" sx={{ opacity: 0.9, fontWeight: 500 }}>
          {label}
        </Typography>
        {subtitle && (
          <Typography variant="caption" sx={{ opacity: 0.75, display: 'block', mt: 0.5 }}>
            {subtitle}
          </Typography>
        )}
      </Box>
      {icon && <Box sx={{ opacity: 0.7, fontSize: 28 }}>{icon}</Box>}
    </Box>
    <Box>
      <Typography variant="h5" sx={{ fontWeight: 700, mt: 1 }}>
        {value}
      </Typography>
      {trend !== undefined && (
        <Box sx={{ display: 'flex', alignItems: 'center', mt: 1, gap: 0.5 }}>
          {trend > 0 ? <TrendingUp sx={{ fontSize: 16 }} /> : <TrendingDown sx={{ fontSize: 16 }} />}
          <Typography variant="caption" sx={{ fontWeight: 500 }}>
            {trend > 0 ? '+' : ''}
            {trend}% {trendLabel || 'vs tháng trước'}
          </Typography>
        </Box>
      )}
    </Box>
  </Paper>
);