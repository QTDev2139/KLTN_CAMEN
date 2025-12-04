import React from "react";
import { Box, Paper, Typography, Stack } from "@mui/material";
import {
    ResponsiveContainer,
    LineChart,
    Line,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    BarChart,
    Bar,
    Cell,
} from "recharts";

const monthlyRevenue = [
    { month: "Jan", revenue: 12000 },
    { month: "Feb", revenue: 15000 },
    { month: "Mar", revenue: 18000 },
    { month: "Apr", revenue: 14000 },
    { month: "May", revenue: 20000 },
    { month: "Jun", revenue: 22000 },
];

const topProducts = [
    { name: "Cà phê rang xay - Classic", sales: 420 },
    { name: "Cà phê pha máy - Premium", sales: 320 },
    { name: "Cafe hòa tan - Quick", sales: 210 },
    { name: "Filter Blend - Signature", sales: 160 },
];

// Example stock with many items (could be 20+)
const stockByType = [
    { name: "Hạt nguyên chất", value: 120 },
    { name: "Cà phê rang xay", value: 80 },
    { name: "Bột hòa tan", value: 40 },
    { name: "Blend A", value: 30 },
    { name: "Blend B", value: 25 },
    { name: "Blend C", value: 20 },
    { name: "Sản phẩm D", value: 18 },
    { name: "Sản phẩm E", value: 15 },
    { name: "Sản phẩm F", value: 12 },
    { name: "Sản phẩm G", value: 10 },
    { name: "Sản phẩm H", value: 8 },
    { name: "Sản phẩm I", value: 5 },
    { name: "Sản phẩm J", value: 4 },
    { name: "Sản phẩm K", value: 3 },
    { name: "Sản phẩm L", value: 2 },
    { name: "Sản phẩm M", value: 1 },
    // ... có thể nhiều hơn
];

const monthlyContacts = [
    { month: "Jan", contacts: 24 },
    { month: "Feb", contacts: 18 },
    { month: "Mar", contacts: 32 },
    { month: "Apr", contacts: 28 },
    { month: "May", contacts: 45 },
    { month: "Jun", contacts: 37 },
];

// monthlyRatingsCounts: số lượng review 1..5 sao mỗi tháng
const monthlyRatingsCounts = [
    { month: "Jan", "1": 2, "2": 3, "3": 5, "4": 8, "5": 6 },
    { month: "Feb", "1": 1, "2": 2, "3": 6, "4": 5, "5": 4 },
    { month: "Mar", "1": 0, "2": 1, "3": 4, "4": 10, "5": 17 },
    { month: "Apr", "1": 1, "2": 0, "3": 3, "4": 8, "5": 16 },
    { month: "May", "1": 0, "2": 1, "3": 2, "4": 6, "5": 36 },
    { month: "Jun", "1": 2, "2": 1, "3": 3, "4": 8, "5": 23 },
];

const COLORS = [
    "#1976d2",
    "#ed6c02",
    "#9c27b0",
    "#2e7d32",
    "#d32f2f",
    "#0288d1",
    "#7b1fa2",
    "#f57c00",
    "#388e3c",
    "#c2185b",
];

// Reuse ChartCard component
const ChartCard: React.FC<{ title: string; children: React.ReactNode; height?: number }> = ({
    title,
    children,
    height = 280,
}) => (
    <Paper sx={{ p: 2, borderRadius: 2, boxShadow: 1 }}>
        <Typography variant="h6" sx={{ mb: 1 }}>
            {title}
        </Typography>
        <Box sx={{ width: "100%", height }}>{children}</Box>
    </Paper>
);

// Utility: if many items, show top N and aggregate the rest as "Khác"
const prepareTopNWithOthers = (data: { name: string; value: number }[], topN = 8) => {
    if (!data || data.length <= topN) return data.slice().sort((a, b) => b.value - a.value);
    const sorted = [...data].sort((a, b) => b.value - a.value);
    const top = sorted.slice(0, topN);
    const others = sorted.slice(topN).reduce((s, it) => s + it.value, 0);
    return [...top, { name: "Khác", value: others }];
};

const OverviewScreen: React.FC = () => {
    const barStockData = prepareTopNWithOthers(stockByType, 8);

    return (
        <Box sx={{ p: 2 }}>
            <Typography variant="h4" sx={{ mb: 2 }}>
                Thống kê sản phẩm
            </Typography>

            <Stack spacing={2}>
                {/* Doanh thu theo tháng */}
                <ChartCard title="Doanh thu theo tháng" height={300}>
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={monthlyRevenue} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip formatter={(value: any) => new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(value)} />
                            <Legend />
                            <Line type="monotone" dataKey="revenue" stroke="#1976d2" strokeWidth={3} dot={{ r: 4 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </ChartCard>

                {/* Top sản phẩm bán chạy */}
                <ChartCard title="Top sản phẩm bán chạy" height={260}>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={topProducts} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" tick={{ fontSize: 12 }} interval={0} />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="sales" fill="#ed6c02" />
                        </BarChart>
                    </ResponsiveContainer>
                </ChartCard>

                {/* Two-column 50/50: left = Tồn kho (bar vertical), right = Liên hệ + Đánh giá (stacked) */}
                <Box sx={{ display: "flex", gap: 2 }}>
                    {/* Left column - stock (vertical bar chart) */}
                    <Box sx={{ flex: 1 }}>
                        <ChartCard title="Tồn kho theo loại (Top 8 + Khác)" height={520}>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                    layout="vertical"
                                    data={barStockData}
                                    margin={{ top: 10, right: 30, left: 80, bottom: 10 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis type="number" />
                                    <YAxis dataKey="name" type="category" width={160} tick={{ fontSize: 12 }} />
                                    <Tooltip formatter={(value: any) => `${value}`} />
                                    <Bar dataKey="value" fill="#1976d2" barSize={14}>
                                        {barStockData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </ChartCard>
                    </Box>

                    {/* Right column - stacked: contacts + ratings */}
                    <Box sx={{ flex: 1, display: "flex", flexDirection: "column", gap: 2 }}>
                        <ChartCard title="Số lượng liên hệ theo tháng" height={260}>
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={monthlyContacts} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="month" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Line type="monotone" dataKey="contacts" stroke="#2e7d32" strokeWidth={2} dot />
                                </LineChart>
                            </ResponsiveContainer>
                        </ChartCard>

                        <ChartCard title="Đánh giá sao theo tháng (số lượng 1..5 sao)" height={260}>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={monthlyRatingsCounts} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="month" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    {/* stacked bars: 1..5 */}
                                    <Bar dataKey="1" stackId="a" fill="#d32f2f" name="1 sao" />
                                    <Bar dataKey="2" stackId="a" fill="#f57c00" name="2 sao" />
                                    <Bar dataKey="3" stackId="a" fill="#ffb300" name="3 sao" />
                                    <Bar dataKey="4" stackId="a" fill="#2e7d32" name="4 sao" />
                                    <Bar dataKey="5" stackId="a" fill="#1976d2" name="5 sao" />
                                </BarChart>
                            </ResponsiveContainer>
                        </ChartCard>
                    </Box>
                </Box>
            </Stack>
        </Box>
    );
};

export default OverviewScreen;