import React from 'react';
import {
    Box,
    Button,
    Card,
    CardContent,
    CardMedia,
    Container,
    Grid,
    TextField,
    Typography,
    useTheme,
    IconButton,
} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
// Thêm icon kim cương cho tiêu đề Timeline
import DiamondIcon from '@mui/icons-material/Diamond';

type Product = {
    id: string;
    title: string;
    price: string;
    image: string;
};

// Giữ nguyên dữ liệu mẫu
const sampleProducts: Product[] = [
    { id: '1', title: 'Petite Gold Ring', price: '$120', image: 'https://images.unsplash.com/photo-1585386959984-a4155227c0f2?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3&s=6d6c6a7c0f5f9c3a7e6b9a9f9f3b2c1d' },
    { id: '2', title: 'Minimal Necklace', price: '$180', image: 'https://images.unsplash.com/photo-1520975914090-3b8c4c3a0c2f?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3&s=7a5a2cf13b4b3396d1a6c9d8f3f2b1c8' },
    { id: '3', title: 'Classic Earrings', price: '$95', image: 'https://images.unsplash.com/photo-1600180758890-2a6a9bd6f3a7?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3&s=2d4e6f7a5b8c9d0e1f2a3b4c5d6e7f8a' },
    { id: '4', title: 'Signet Ring', price: '$210', image: 'https://images.unsplash.com/photo-1549237518-0a8f0d8b7b1c?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3&s=3b2a1c0d9e8f7a6b5c4d3e2f1a0b9c8d' },
];

const categories = [
    { id: 'c1', title: 'Rings', image: 'https://images.unsplash.com/photo-1523675491293-32c9d2b8a3f0?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3&s=4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e' },
    { id: 'c2', title: 'Necklaces', image: 'https://images.unsplash.com/photo-1490367532201-b9bc1dc483f6?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3&s=9c8b7a6d5e4f3a2b1c0d9e8f7a6b5c4d' },
    { id: 'c3', title: 'Earrings', image: 'https://images.unsplash.com/photo-1536305030019-3f3b97f3a2a9?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3&s=8a7b6c5d4e3f2a1b0c9d8e7f6a5b4c3d' },
];

// Dữ liệu mới cho Timeline, khớp với hình ảnh bạn cung cấp
const timelineData = [
    {
        year: '2025',
        title: 'Đánh dấu hành trình 15 năm phát triển',
        desc: 'Đoạn đổi mới toàn diện – kết hợp giữa tinh hoa nghề kim truyền thống và công nghệ hiện đại, hướng đến mục tiêu trở thành thương hiệu trang sức cao cấp hàng đầu tại Việt Nam và vươn tầm khu vực Đông Nam Á.',
    },
    {
        year: '2022',
        title: 'Thay đổi chiến lược phát triển bền vững',
        desc: 'Với khát vọng chuyên mình mạnh mẽ, ngày 20/10/2022, công ty chính thức đổi tên thành Công ty Camenfood Việt Nam, khẳng định chiến lược phát triển bền vững và bản sắc thương hiệu riêng. Bên cạnh đó, doanh nghiệp tiến hành tái cơ cấu bộ máy quản trị, đổi mới quy trình sản xuất, nâng cấp dịch vụ khách hàng và mở rộng thị trường trong nước lẫn quốc tế.',
    },
    {
        year: '2020',
        title: 'Đánh dấu cột mốc 10 năm hình thành và phát triển',
        desc: 'Với nền tảng vững chắc từ chặng đường đầu tiên, công ty tiếp tục gia tăng quy mô hoạt động, cải tiến công nghệ và kỹ thuật gia công hiện đại.',
    },
    {
        year: '2018',
        title: 'Đánh dấu cột mốc 10 năm hình thành và phát triển',
        desc: 'Với nền tảng vững chắc từ chặng đường đầu tiên, công ty tiếp tục gia tăng quy mô hoạt động, cải tiến công nghệ và kỹ thuật gia công hiện đại.',
    },
    
];

const HomePage: React.FC = () => {
    const { palette } = useTheme();

    return (
        <Box component="main">
            {/* Hero */}
            <Box
                sx={{
                    backgroundImage: `url('https://anhkythuatso.vn/background-dep-de-ghep-anh')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    color: '#fff',
                    py: { xs: 8, md: 18 },
                    textAlign: 'center',
                }}
            >
                <Container maxWidth="lg">
                    <Typography variant="h3" component="h1" sx={{ fontWeight: 700, mb: 2 }}>
                        Handcrafted Jewelry
                    </Typography>
                    <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
                        Timeless design — ethically sourced materials
                    </Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        size="large"
                        endIcon={<ArrowForwardIcon />}
                    >
                        Shop Collection
                    </Button>
                </Container>
            </Box>

            {/* Lịch sử hình thành và phát triển - ĐÃ CẬP NHẬT */}
            <Container maxWidth="lg" sx={{ py: 8 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
                    <DiamondIcon color="primary" sx={{ mr: 1, fontSize: '2rem' }} />
                    <Typography variant="h5" sx={{ fontWeight: 600 }}>
                        Lịch sử hình thành & phát triển
                    </Typography>
                </Box>
                
                {/* Timeline */}
                <Box sx={{ position: 'relative', px: { xs: 1, md: 4 } }}>
                    {/* vertical center line */}
                    <Box
                        sx={{
                            position: 'absolute',
                            left: '50%',
                            top: 0, // Bắt đầu từ đầu
                            bottom: 0,
                            width: 2,
                            bgcolor: 'grey.300',
                            transform: 'translateX(-50%)',
                            zIndex: 1,
                        }}
                    />

                    {/* items */}
                    {timelineData.map((item, idx) => {
                        const isLeft = idx % 2 === 0; // Năm sẽ luôn nằm bên trái để tạo bố cục thẳng đứng

                        // Tính toán margin-top để căn chỉnh mốc thời gian (center dot) 
                        // với vị trí của text trong block nội dung bên phải, 
                        // và ngược lại nếu item ở bên phải (như mẫu cũ bạn gửi)
                        // Tuy nhiên, để giống với ảnh bạn gửi (chỉ có 1 cột nội dung), ta sẽ cố định bố cục.

                        return (
                            <Box
                                key={item.year}
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'flex-start', // Đặt nội dung sang một bên
                                    alignItems: 'flex-start',
                                    mb: { xs: 6, md: 8 },
                                    position: 'relative',
                                    zIndex: 2,
                                    flexDirection: { xs: 'column', md: 'row' },
                                }}
                            >
                                {/* Left block - YEAR (45% width) */}
                                <Box
                                    sx={{
                                        width: { xs: '100%', md: '50%' },
                                        pr: { xs: 0, md: 3 },
                                        textAlign: 'right', // Căn phải cho năm
                                    }}
                                >
                                    <Typography variant="h3" sx={{ fontWeight: 700, color: palette.primary.main }}>
                                        {item.year}
                                    </Typography>
                                </Box>

                                {/* Center dot / connector (10% width) */}
                                <Box
                                    sx={{
                                        width: { xs: '100%', md: '0%' }, // Ẩn cột này ở mobile
                                        display: { xs: 'none', md: 'flex' },
                                        justifyContent: 'center',
                                        alignItems: 'flex-start',
                                        mt: { xs: 2, md: 0 },
                                    }}
                                >
                                    <Box
                                        sx={{
                                            position: 'absolute', // Đặt tuyệt đối để căn giữa đường kẻ
                                            left: '50%',
                                            transform: 'translateX(-50%)',
                                            width: 16,
                                            height: 16,
                                            borderRadius: '50%',
                                            bgcolor: 'primary.main',
                                            border: '4px solid',
                                            borderColor: 'background.paper',
                                            boxShadow: 2,
                                            mt: 0.5, // Căn giữa theo text năm
                                        }}
                                    />
                                </Box>

                                {/* Right block - CONTENT (45% width) */}
                                <Box
                                    sx={{
                                        width: { xs: '100%', md: '50%' },
                                        pl: { xs: 0, md: 3 },
                                        textAlign: 'left', // Căn trái cho nội dung
                                        mt: { xs: 1, md: 0 },
                                    }}
                                >
                                    <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 0.5 }}>
                                        {item.title}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{lineHeight: 1.6}}>
                                        {item.desc}
                                    </Typography>
                                </Box>
                            </Box>
                        );
                    })}
                </Box>
            </Container>

            {/* Newsletter */}
            <Container maxWidth="lg" sx={{ py: 8 }}>
                <Grid container alignItems="center" spacing={4}>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                            Join our newsletter
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                            Exclusive drops, early access and offers — delivered monthly.
                        </Typography>
                        <Box component="form" sx={{ display: 'flex', gap: 1, maxWidth: 500 }}>
                            <TextField fullWidth placeholder="Your email" size="small" />
                            <IconButton color="primary" aria-label="subscribe" sx={{ bgcolor: palette.primary.main, color: '#fff', '&:hover': { bgcolor: palette.primary.dark } }}>
                                <ArrowForwardIcon />
                            </IconButton>
                        </Box>
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Box sx={{ height: 160, backgroundImage: `url('https://images.unsplash.com/photo-1505765050326-10d1b3f7d4f0?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3&s=1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d')`, backgroundSize: 'cover', borderRadius: 2 }} />
                    </Grid>
                </Grid>
            </Container>

            
        </Box>
    );
}
export default HomePage;