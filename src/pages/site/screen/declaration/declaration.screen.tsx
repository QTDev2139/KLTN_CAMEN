import React from 'react';
import {
    Box,
    Container,
    Typography,
    useTheme,
    Grid,
    Paper,
    Fade,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Chip,
} from '@mui/material';
import { keyframes } from '@mui/system';
import {
    ExpandMore,
    PictureAsPdf,
    Description,
    VerifiedUser,
    FilePresent,
} from '@mui/icons-material';

// Keyframe animations
const fadeInUp = keyframes`
    from {
        opacity: 0;
        transform: translateY(30px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
`;

const float = keyframes`
    0%, 100% {
        transform: translateY(0px);
    }
    50% {
        transform: translateY(-15px);
    }
`;

interface PDFFile {
    name: string;
    url: string;
    size?: string;
}

interface Product {
    id: string;
    name: string;
    color: string;
    gradient: string;
    image: string;
    files: PDFFile[];
}

const DeclarationPage: React.FC = () => {
    const { palette } = useTheme();
    const [isVisible, setIsVisible] = React.useState(false);
    const [expanded, setExpanded] = React.useState<string | false>(false);

    React.useEffect(() => {
        setIsVisible(true);
    }, []);

    const handleChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
        setExpanded(isExpanded ? panel : false);
    };

    const products: Product[] = [
        {
            id: 'banh-canh-ca-loc',
            name: 'Bánh Canh Cá Lóc',
            color: '#4CAF50',
            gradient: 'linear-gradient(135deg, #4CAF50 0%, #81C784 100%)',
            image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600&auto=format&fit=crop',
            files: [
                { name: 'Công bố sản phẩm Bánh canh cá lóc', url: '/pdfs/banh-canh-ca-loc-1.pdf', size: '2.3 MB' },
                { name: 'Giấy chứng nhận vệ sinh an toàn thực phẩm', url: '/pdfs/banh-canh-ca-loc-2.pdf', size: '1.8 MB' },
                { name: 'Kết quả kiểm nghiệm chất lượng sản phẩm', url: '/pdfs/banh-canh-ca-loc-3.pdf', size: '3.1 MB' },
                { name: 'Thông tin dinh dưỡng và thành phần', url: '/pdfs/banh-canh-ca-loc-4.pdf', size: '1.5 MB' },
            ],
        },
        {
            id: 'banh-canh-cha-ca',
            name: 'Bánh Canh Chả Cá',
            color: '#2196F3',
            gradient: 'linear-gradient(135deg, #2196F3 0%, #64B5F6 100%)',
            image: 'https://images.unsplash.com/photo-1617093727343-374698b1b08d?w=600&auto=format&fit=crop',
            files: [
                { name: 'Công bố sản phẩm Bánh canh chả cá', url: '/pdfs/banh-canh-cha-ca-1.pdf', size: '2.1 MB' },
                { name: 'Giấy chứng nhận vệ sinh an toàn thực phẩm', url: '/pdfs/banh-canh-cha-ca-2.pdf', size: '1.9 MB' },
                { name: 'Kết quả kiểm nghiệm chất lượng sản phẩm', url: '/pdfs/banh-canh-cha-ca-3.pdf', size: '2.8 MB' },
                { name: 'Thông tin dinh dưỡng và thành phần', url: '/pdfs/banh-canh-cha-ca-4.pdf', size: '1.6 MB' },
            ],
        },
        {
            id: 'banh-canh-cua',
            name: 'Bánh Canh Cua',
            color: '#FF9800',
            gradient: 'linear-gradient(135deg, #FF9800 0%, #FFB74D 100%)',
            image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?w=600&auto=format&fit=crop',
            files: [
                { name: 'Công bố sản phẩm Bánh canh cua', url: '/pdfs/banh-canh-cua-1.pdf', size: '2.5 MB' },
                { name: 'Giấy chứng nhận vệ sinh an toàn thực phẩm', url: '/pdfs/banh-canh-cua-2.pdf', size: '1.7 MB' },
                { name: 'Kết quả kiểm nghiệm chất lượng sản phẩm', url: '/pdfs/banh-canh-cua-3.pdf', size: '3.2 MB' },
                { name: 'Thông tin dinh dưỡng và thành phần', url: '/pdfs/banh-canh-cua-4.pdf', size: '1.4 MB' },
            ],
        },
        {
            id: 'bun-bo-hue',
            name: 'Bún Bò Huế',
            color: '#F44336',
            gradient: 'linear-gradient(135deg, #F44336 0%, #EF5350 100%)',
            image: 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=600&auto=format&fit=crop',
            files: [
                { name: 'Công bố sản phẩm Bún bò Huế', url: '/pdfs/bun-bo-hue-1.pdf', size: '2.4 MB' },
                { name: 'Giấy chứng nhận vệ sinh an toàn thực phẩm', url: '/pdfs/bun-bo-hue-2.pdf', size: '2.0 MB' },
                { name: 'Kết quả kiểm nghiệm chất lượng sản phẩm', url: '/pdfs/bun-bo-hue-3.pdf', size: '2.9 MB' },
                { name: 'Thông tin dinh dưỡng và thành phần', url: '/pdfs/bun-bo-hue-4.pdf', size: '1.7 MB' },
            ],
        },
        {
            id: 'bun-luon-xao-nghe',
            name: 'Bún Lươn Xào Nghệ',
            color: '#9C27B0',
            gradient: 'linear-gradient(135deg, #9C27B0 0%, #BA68C8 100%)',
            image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=600&auto=format&fit=crop',
            files: [
                { name: 'Công bố sản phẩm Bún lươn xào nghệ', url: '/pdfs/bun-luon-xao-nghe-1.pdf', size: '2.2 MB' },
                { name: 'Giấy chứng nhận vệ sinh an toàn thực phẩm', url: '/pdfs/bun-luon-xao-nghe-2.pdf', size: '1.8 MB' },
                { name: 'Kết quả kiểm nghiệm chất lượng sản phẩm', url: '/pdfs/bun-luon-xao-nghe-3.pdf', size: '3.0 MB' },
                { name: 'Thông tin dinh dưỡng và thành phần', url: '/pdfs/bun-luon-xao-nghe-4.pdf', size: '1.5 MB' },
            ],
        },
        {
            id: 'mien-luon',
            name: 'Miến Lươn',
            color: '#00BCD4',
            gradient: 'linear-gradient(135deg, #00BCD4 0%, #4DD0E1 100%)',
            image: 'https://images.unsplash.com/photo-1612927601601-6638404737ce?w=600&auto=format&fit=crop',
            files: [
                { name: 'Công bố sản phẩm Miến lươn', url: '/pdfs/mien-luon-1.pdf', size: '2.6 MB' },
                { name: 'Giấy chứng nhận vệ sinh an toàn thực phẩm', url: '/pdfs/mien-luon-2.pdf', size: '1.9 MB' },
                { name: 'Kết quả kiểm nghiệm chất lượng sản phẩm', url: '/pdfs/mien-luon-3.pdf', size: '2.7 MB' },
                { name: 'Thông tin dinh dưỡng và thành phần', url: '/pdfs/mien-luon-4.pdf', size: '1.6 MB' },
            ],
        },
    ];

    return (
        <Box component="main" sx={{ bgcolor: palette.background.default }}>
            {/* Hero Section */}
            <Box
                sx={{
                    position: 'relative',
                    minHeight: { xs: '350px', md: '450px' },
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                    background: `linear-gradient(135deg, ${palette.primary.main}08 0%, ${palette.secondary.main}08 100%)`,
                    '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundImage: 'url("https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=1600&auto=format&fit=crop")',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        opacity: 0.05,
                        filter: 'grayscale(100%)',
                    },
                }}
            >
                {/* Decorative elements */}
                <Box
                    sx={{
                        position: 'absolute',
                        top: '10%',
                        right: '8%',
                        width: { xs: '150px', md: '250px' },
                        height: { xs: '150px', md: '250px' },
                        borderRadius: '50%',
                        background: `radial-gradient(circle, ${palette.primary.main}12 0%, transparent 70%)`,
                        animation: `${float} 8s ease-in-out infinite`,
                    }}
                />

                <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
                    <Fade in={isVisible} timeout={1000}>
                        <Box sx={{ textAlign: 'center', px: 2 }}>
                            {/* Badge */}
                            <Box
                                sx={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: 1,
                                    px: 3,
                                    py: 1,
                                    mb: 3,
                                    borderRadius: 50,
                                    border: `2px solid ${palette.primary.main}30`,
                                    background: `${palette.primary.main}10`,
                                    animation: `${fadeInUp} 1s ease-out`,
                                }}
                            >
                                <VerifiedUser sx={{ fontSize: 20, color: palette.primary.main }} />
                                <Typography
                                    variant="body2"
                                    sx={{
                                        fontWeight: 600,
                                        color: palette.primary.main,
                                        textTransform: 'uppercase',
                                        letterSpacing: 1,
                                    }}
                                >
                                    Tài liệu chính thức
                                </Typography>
                            </Box>

                            <Typography
                                variant="h2"
                                component="h1"
                                sx={{
                                    fontWeight: 700,
                                    mb: 2,
                                    fontSize: { xs: '2rem', md: '3.5rem' },
                                    color: palette.text.primary,
                                    animation: `${fadeInUp} 1s ease-out 0.2s`,
                                    animationFillMode: 'both',
                                }}
                            >
                                Hồ Sơ Công Bố Sản Phẩm
                            </Typography>

                            <Typography
                                variant="h5"
                                sx={{
                                    mb: 3,
                                    fontSize: { xs: '1rem', md: '1.3rem' },
                                    maxWidth: '800px',
                                    margin: '0 auto',
                                    color: palette.text.secondary,
                                    lineHeight: 1.7,
                                    animation: `${fadeInUp} 1s ease-out 0.4s`,
                                    animationFillMode: 'both',
                                }}
                            >
                                Toàn bộ giấy tờ, chứng nhận và thông tin minh bạch về các sản phẩm Cà Mèn
                            </Typography>

                            <Chip
                                icon={<FilePresent />}
                                label={`${products.length} Sản phẩm • ${products.length * 4} Tài liệu`}
                                sx={{
                                    mt: 2,
                                    px: 2,
                                    py: 2.5,
                                    fontSize: '1rem',
                                    fontWeight: 600,
                                    background: palette.primary.main,
                                    color: '#fff',
                                    animation: `${fadeInUp} 1s ease-out 0.6s`,
                                    animationFillMode: 'both',
                                    '& .MuiChip-icon': {
                                        color: '#fff',
                                    },
                                }}
                            />
                        </Box>
                    </Fade>
                </Container>
            </Box>

            {/* Products List Section */}
            <Box sx={{ py: { xs: 6, md: 10 } }}>
                <Container maxWidth="lg">
                    <Fade in={isVisible} timeout={800}>
                        <Box sx={{ mb: 6, textAlign: 'center' }}>
                            <Typography
                                variant="h4"
                                component="h2"
                                sx={{
                                    fontWeight: 700,
                                    mb: 2,
                                    color: palette.text.primary,
                                    fontSize: { xs: '1.5rem', md: '2rem' },
                                }}
                            >
                                Danh Sách Sản Phẩm
                            </Typography>
                            <Typography
                                variant="body1"
                                sx={{
                                    color: palette.text.secondary,
                                    maxWidth: '600px',
                                    margin: '0 auto',
                                }}
                            >
                                Click vào từng sản phẩm để xem chi tiết hồ sơ công bố
                            </Typography>
                        </Box>
                    </Fade>

                    <Grid container spacing={3}>
                        {products.map((product, index) => (
                            <Grid size={{ xs: 12 }} key={product.id}>
                                <Fade
                                    in={isVisible}
                                    timeout={800}
                                    style={{ transitionDelay: `${index * 0.1}s` }}
                                >
                                    <Accordion
                                        expanded={expanded === product.id}
                                        onChange={handleChange(product.id)}
                                        sx={{
                                            borderRadius: 3,
                                            overflow: 'hidden',
                                            border: `2px solid ${expanded === product.id ? product.color : palette.divider}`,
                                            boxShadow: expanded === product.id 
                                                ? `0 8px 32px ${product.color}30` 
                                                : '0 2px 8px rgba(0,0,0,0.08)',
                                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                            '&:before': {
                                                display: 'none',
                                            },
                                            '&:hover': {
                                                transform: 'translateY(-4px)',
                                                boxShadow: `0 12px 40px ${product.color}25`,
                                            },
                                        }}
                                    >
                                        <AccordionSummary
                                            expandIcon={
                                                <ExpandMore 
                                                    sx={{ 
                                                        color: expanded === product.id ? product.color : palette.text.secondary,
                                                        fontSize: 32,
                                                    }} 
                                                />
                                            }
                                            sx={{
                                                minHeight: 100,
                                                background: expanded === product.id 
                                                    ? `${product.color}08` 
                                                    : palette.background.paper,
                                                px: 3,
                                                py: 2,
                                                transition: 'all 0.3s ease',
                                                '&:hover': {
                                                    background: `${product.color}12`,
                                                },
                                            }}
                                        >
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 2, md: 3 }, flex: 1 }}>
                                                {/* Product Image */}
                                                <Box
                                                    sx={{
                                                        position: 'relative',
                                                        width: { xs: 80, md: 100 },
                                                        height: { xs: 80, md: 100 },
                                                        borderRadius: 2,
                                                        overflow: 'hidden',
                                                        boxShadow: `0 4px 12px ${product.color}40`,
                                                        flexShrink: 0,
                                                    }}
                                                >
                                                    <Box
                                                        component="img"
                                                        src={product.image}
                                                        alt={product.name}
                                                        sx={{
                                                            width: '100%',
                                                            height: '100%',
                                                            objectFit: 'cover',
                                                        }}
                                                    />
                                                </Box>

                                                <Box sx={{ flex: 1, minWidth: 0 }}>
                                                    <Typography
                                                        variant="h6"
                                                        sx={{
                                                            fontWeight: 700,
                                                            color: expanded === product.id ? product.color : palette.text.primary,
                                                            fontSize: { xs: '1.1rem', md: '1.3rem' },
                                                            mb: 0.5,
                                                        }}
                                                    >
                                                        {product.name}
                                                    </Typography>
                                                    <Typography
                                                        variant="body2"
                                                        sx={{
                                                            color: palette.text.secondary,
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: 0.5,
                                                        }}
                                                    >
                                                        <Description sx={{ fontSize: 16 }} />
                                                        {product.files.length} tài liệu
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </AccordionSummary>

                                        <AccordionDetails
                                            sx={{
                                                p: 0,
                                                background: palette.grey[50],
                                            }}
                                        >
                                            <List sx={{ p: 0 }}>
                                                {product.files.map((file, fileIndex) => (
                                                    <ListItem
                                                        key={fileIndex}
                                                        component="a"
                                                        href={file.url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        sx={{
                                                            py: 2.5,
                                                            px: 3,
                                                            borderBottom: fileIndex < product.files.length - 1 
                                                                ? `1px solid ${palette.divider}` 
                                                                : 'none',
                                                            transition: 'all 0.2s ease',
                                                            cursor: 'pointer',
                                                            textDecoration: 'none',
                                                            color: 'inherit',
                                                            '&:hover': {
                                                                background: '#fff',
                                                                pl: 4,
                                                                '& .pdf-icon': {
                                                                    transform: 'scale(1.1)',
                                                                    color: product.color,
                                                                },
                                                            },
                                                        }}
                                                    >
                                                        <ListItemIcon sx={{ minWidth: 50 }}>
                                                            <Box
                                                                className="pdf-icon"
                                                                sx={{
                                                                    width: 40,
                                                                    height: 40,
                                                                    borderRadius: 1,
                                                                    background: `${product.color}15`,
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    justifyContent: 'center',
                                                                    transition: 'all 0.3s ease',
                                                                }}
                                                            >
                                                                <PictureAsPdf 
                                                                    sx={{ 
                                                                        fontSize: 24, 
                                                                        color: product.color,
                                                                    }} 
                                                                />
                                                            </Box>
                                                        </ListItemIcon>
                                                        <ListItemText
                                                            primary={
                                                                <Typography
                                                                    variant="body1"
                                                                    sx={{
                                                                        fontWeight: 600,
                                                                        color: palette.text.primary,
                                                                        mb: 0.5,
                                                                    }}
                                                                >
                                                                    {file.name}
                                                                </Typography>
                                                            }
                                                            secondary={
                                                                <Typography
                                                                    variant="caption"
                                                                    sx={{
                                                                        color: palette.text.secondary,
                                                                    }}
                                                                >
                                                                    PDF • {file.size}
                                                                </Typography>
                                                            }
                                                        />
                                                    </ListItem>
                                                ))}
                                            </List>
                                        </AccordionDetails>
                                    </Accordion>
                                </Fade>
                            </Grid>
                        ))}
                    </Grid>

                    {/* Info Box */}
                    <Fade in={isVisible} timeout={1000}>
                        <Paper
                            elevation={0}
                            sx={{
                                mt: 6,
                                p: 4,
                                borderRadius: 3,
                                background: `linear-gradient(135deg, ${palette.primary.main}08 0%, ${palette.secondary.main}08 100%)`,
                                border: `2px solid ${palette.primary.main}20`,
                            }}
                        >
                            <Box sx={{ textAlign: 'center' }}>
                                <VerifiedUser 
                                    sx={{ 
                                        fontSize: 48, 
                                        color: palette.primary.main,
                                        mb: 2,
                                    }} 
                                />
                                <Typography
                                    variant="h6"
                                    sx={{
                                        fontWeight: 700,
                                        color: palette.text.primary,
                                        mb: 1,
                                    }}
                                >
                                    Cam Kết Minh Bạch
                                </Typography>
                                <Typography
                                    variant="body1"
                                    sx={{
                                        color: palette.text.secondary,
                                        maxWidth: '700px',
                                        margin: '0 auto',
                                        lineHeight: 1.7,
                                    }}
                                >
                                    Tất cả sản phẩm của Cà Mèn đều được công bố đầy đủ thông tin, 
                                    đạt chuẩn an toàn thực phẩm và có giấy chứng nhận từ các cơ quan có thẩm quyền.
                                </Typography>
                            </Box>
                        </Paper>
                    </Fade>
                </Container>
            </Box>
        </Box>
    );
};

export default DeclarationPage;
