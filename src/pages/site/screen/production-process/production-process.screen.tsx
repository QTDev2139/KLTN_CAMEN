import React from 'react';
import {
    Box,
    Container,
    Typography,
    useTheme,
    Grid,
    Paper,
    Fade,
    Zoom,
} from '@mui/material';
import { keyframes } from '@mui/system';
import {
    AcUnit,
    LocalShipping,
    Inventory,
    VerifiedUser,
    CheckCircleOutline,
} from '@mui/icons-material';

// Keyframe animations
const fadeInUp = keyframes`
    from {
        opacity: 0;
        transform: translateY(40px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
`;

const slideInLeft = keyframes`
    from {
        opacity: 0;
        transform: translateX(-60px);
    }
    to {
        opacity: 1;
        transform: translateX(0);
    }
`;

const slideInRight = keyframes`
    from {
        opacity: 0;
        transform: translateX(60px);
    }
    to {
        opacity: 1;
        transform: translateX(0);
    }
`;

const float = keyframes`
    0%, 100% {
        transform: translateY(0px);
    }
    50% {
        transform: translateY(-20px);
    }
`;

const pulse = keyframes`
    0%, 100% {
        transform: scale(1);
        opacity: 1;
    }
    50% {
        transform: scale(1.05);
        opacity: 0.8;
    }
`;

const rotate = keyframes`
    from {
        transform: rotate(0deg);
    }
    to {
        transform: rotate(360deg);
    }
`;

interface ProcessStep {
    icon: React.ReactNode;
    title: string;
    description: string;
    color: string;
    gradient: string;
    image: string;
}

const ProductionProcessPage: React.FC = () => {
    const { palette } = useTheme();
    const [isVisible, setIsVisible] = React.useState(false);
    const [visibleSteps, setVisibleSteps] = React.useState<boolean[]>([]);
    const stepRefs = React.useRef<(HTMLDivElement | null)[]>([]);

    React.useEffect(() => {
        setIsVisible(true);
        
        // Intersection Observer for scroll animations
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    const index = stepRefs.current.findIndex(ref => ref === entry.target);
                    if (index !== -1 && entry.isIntersecting) {
                        setVisibleSteps(prev => {
                            const newState = [...prev];
                            newState[index] = true;
                            return newState;
                        });
                    }
                });
            },
            { threshold: 0.2 }
        );

        stepRefs.current.forEach(ref => {
            if (ref) observer.observe(ref);
        });

        return () => observer.disconnect();
    }, []);

    const processSteps: ProcessStep[] = [
        {
            icon: <VerifiedUser sx={{ fontSize: 60 }} />,
            title: 'Nguyên liệu đầu vào đạt chuẩn – Tuyển chọn kỹ lưỡng',
            description: 'Tụi mình rất chú trọng vào chất lượng nguyên liệu đầu vào. Tất cả thành phần – từ thịt, cá, cua đến rau nấm – đều được kiểm tra kỹ lưỡng về nguồn gốc và tiêu chuẩn an toàn thực phẩm trước khi đưa vào sản xuất.',
            color: '#4CAF50',
            gradient: 'linear-gradient(135deg, #4CAF50 0%, #81C784 100%)',
            image: 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=800&auto=format&fit=crop',
        },
        {
            icon: <CheckCircleOutline sx={{ fontSize: 60 }} />,
            title: 'Quy trình kiểm soát chặt chẽ – An tâm trong từng gói',
            description: 'Từng công đoạn sản xuất tại Cà Mèn đều được giám sát chặt chẽ theo quy trình khép kín. Từ kiểm tra nguyên liệu, chế biến, cấp đông đến đóng gói – mọi công đoạn đều được thực hiện cẩn thận để đảm bảo mỗi thành phẩm khi xuất xưởng đều đạt chất lượng đồng đều, an toàn và ngon miệng.',
            color: '#2196F3',
            gradient: 'linear-gradient(135deg, #2196F3 0%, #64B5F6 100%)',
            image: 'https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?w=800&auto=format&fit=crop',
        },
        {
            icon: <AcUnit sx={{ fontSize: 60 }} />,
            title: 'Công nghệ cấp đông sâu – Giữ trọn độ tươi và hương vị',
            description: 'Tất cả sản phẩm của Cà Mèn đều được bảo quản bằng công nghệ cấp đông sâu hiện đại, giúp giữ được độ tươi ngon gần như ban đầu của nguyên liệu. Nhờ phương pháp này, sản phẩm vẫn đảm bảo được chất lượng, hương vị và giá trị dinh dưỡng, đồng thời có thể bảo quản lên đến 2 năm kể từ ngày sản xuất mà không cần dùng chất bảo quản.',
            color: '#00BCD4',
            gradient: 'linear-gradient(135deg, #00BCD4 0%, #4DD0E1 100%)',
            image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800&auto=format&fit=crop',
        },
        {
            icon: <Inventory sx={{ fontSize: 60 }} />,
            title: 'Dây chuyền đóng gói hiện đại – Bao bì chỉn chu, an toàn',
            description: 'Cà Mèn đầu tư hệ thống đóng gói chuyên nghiệp, với thiết kế bao bì đẹp mắt, tiện lợi và an toàn vệ sinh thực phẩm. Bao bì không chỉ giúp bảo vệ sản phẩm tối ưu mà còn thể hiện bản sắc và giá trị của ẩm thực Việt qua từng món ăn.',
            color: '#FF9800',
            gradient: 'linear-gradient(135deg, #FF9800 0%, #FFB74D 100%)',
            image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&auto=format&fit=crop',
        },
        {
            icon: <LocalShipping sx={{ fontSize: 60 }} />,
            title: 'Vận chuyển chuyên biệt – Đảm bảo chuỗi lạnh nghiêm ngặt',
            description: 'Trong suốt quá trình phân phối, sản phẩm Cà Mèn được vận chuyển bằng container lạnh và tuân thủ nghiêm ngặt các tiêu chuẩn bảo quản lạnh. Điều này đảm bảo sản phẩm luôn giữ được chất lượng ổn định khi đến tay các nhà phân phối trong nước và quốc tế.',
            color: '#9C27B0',
            gradient: 'linear-gradient(135deg, #9C27B0 0%, #BA68C8 100%)',
            image: 'https://images.unsplash.com/photo-1566576721346-d4a3b4eaeb55?w=800&auto=format&fit=crop',
        },
    ];

    return (
        <Box component="main" sx={{ bgcolor: palette.background.default }}>
            {/* Commitment Section - Hero */}
            <Box
                sx={{
                    position: 'relative',
                    minHeight: { xs: '500px', md: '600px' },
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
                        backgroundImage: 'url("https://images.unsplash.com/photo-1556911220-bff31c812dba?w=1600&auto=format&fit=crop")',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        opacity: 0.08,
                        filter: 'grayscale(100%)',
                    },
                }}
            >
                {/* Decorative elements */}
                <Box
                    sx={{
                        position: 'absolute',
                        top: '5%',
                        right: '5%',
                        width: { xs: '200px', md: '300px' },
                        height: { xs: '200px', md: '300px' },
                        borderRadius: '50%',
                        background: `radial-gradient(circle, ${palette.primary.main}15 0%, transparent 70%)`,
                        animation: `${float} 8s ease-in-out infinite`,
                    }}
                />
                <Box
                    sx={{
                        position: 'absolute',
                        bottom: '10%',
                        left: '3%',
                        width: { xs: '150px', md: '250px' },
                        height: { xs: '150px', md: '250px' },
                        borderRadius: '50%',
                        background: `radial-gradient(circle, ${palette.secondary.main}15 0%, transparent 70%)`,
                        animation: `${float} 10s ease-in-out infinite`,
                        animationDelay: '2s',
                    }}
                />

                <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
                    <Fade in={isVisible} timeout={1200}>
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
                                    Quy Trình Sản Xuất
                                </Typography>
                            </Box>

                            <Typography
                                variant="h2"
                                component="h1"
                                sx={{
                                    fontWeight: 700,
                                    mb: 3,
                                    fontSize: { xs: '2rem', md: '3.5rem' },
                                    color: palette.text.primary,
                                    animation: `${fadeInUp} 1s ease-out 0.2s`,
                                    animationFillMode: 'both',
                                }}
                            >
                                Cam Kết Chất Lượng
                            </Typography>

                            <Typography
                                variant="h5"
                                sx={{
                                    mb: 5,
                                    fontSize: { xs: '1.1rem', md: '1.4rem' },
                                    maxWidth: '900px',
                                    margin: '0 auto 40px',
                                    color: palette.text.secondary,
                                    lineHeight: 1.8,
                                    animation: `${fadeInUp} 1s ease-out 0.4s`,
                                    animationFillMode: 'both',
                                }}
                            >
                                Với quy trình sản xuất khép kín và kiểm soát chặt chẽ từng công đoạn,
                                Cà Mèn cam kết mang đến cho bạn những sản phẩm chất lượng cao nhất,
                                giữ trọn hương vị đặc trưng của ẩm thực Việt Nam.
                            </Typography>

                            {/* Stats Cards */}
                            <Grid 
                                container 
                                spacing={3} 
                                justifyContent="center"
                                sx={{
                                    animation: `${fadeInUp} 1s ease-out 0.6s`,
                                    animationFillMode: 'both',
                                }}
                            >
                                {[
                                    { number: '100%', label: 'Nguyên liệu tươi sạch', icon: <VerifiedUser /> },
                                    { number: '2 năm', label: 'Thời hạn bảo quản', icon: <AcUnit /> },
                                    { number: '0%', label: 'Chất bảo quản', icon: <CheckCircleOutline /> },
                                ].map((stat, index) => (
                                    <Grid size={{ xs: 12, sm: 4 }} key={index}>
                                        <Paper
                                            elevation={0}
                                            sx={{
                                                p: 3,
                                                borderRadius: 3,
                                                background: '#fff',
                                                border: `2px solid ${palette.primary.main}20`,
                                                transition: 'all 0.3s ease',
                                                '&:hover': {
                                                    transform: 'translateY(-8px)',
                                                    boxShadow: `0 12px 40px ${palette.primary.main}20`,
                                                    borderColor: palette.primary.main,
                                                },
                                            }}
                                        >
                                            <Box
                                                sx={{
                                                    width: 60,
                                                    height: 60,
                                                    borderRadius: '50%',
                                                    background: `linear-gradient(135deg, ${palette.primary.main} 0%, ${palette.primary.light} 100%)`,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    color: '#fff',
                                                    margin: '0 auto 16px',
                                                    boxShadow: `0 4px 12px ${palette.primary.main}30`,
                                                }}
                                            >
                                                {stat.icon}
                                            </Box>
                                            <Typography
                                                variant="h3"
                                                sx={{
                                                    fontWeight: 800,
                                                    color: palette.primary.main,
                                                    mb: 1,
                                                    fontSize: { xs: '2rem', md: '2.5rem' },
                                                }}
                                            >
                                                {stat.number}
                                            </Typography>
                                            <Typography
                                                variant="body1"
                                                sx={{
                                                    color: palette.text.secondary,
                                                    fontWeight: 600,
                                                }}
                                            >
                                                {stat.label}
                                            </Typography>
                                        </Paper>
                                    </Grid>
                                ))}
                            </Grid>
                        </Box>
                    </Fade>
                </Container>
            </Box>

            {/* Process Steps Section */}
            <Box sx={{ py: { xs: 8, md: 12 }, position: 'relative' }}>
                {/* Background decoration */}
                <Box
                    sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        opacity: 0.03,
                        backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)',
                        backgroundSize: '40px 40px',
                        pointerEvents: 'none',
                    }}
                />

                <Container maxWidth="lg" sx={{ position: 'relative' }}>
                    {/* Vertical Timeline Line */}
                    <Box
                        sx={{
                            position: 'absolute',
                            left: '50%',
                            top: 100,
                            bottom: 100,
                            width: '4px',
                            background: `linear-gradient(to bottom, ${palette.primary.light}, ${palette.primary.main})`,
                            transform: 'translateX(-50%)',
                            display: { xs: 'none', md: 'block' },
                            '&::before': {
                                content: '""',
                                position: 'absolute',
                                top: 0,
                                left: '50%',
                                transform: 'translateX(-50%)',
                                width: '20px',
                                height: '20px',
                                borderRadius: '50%',
                                bgcolor: palette.primary.main,
                                animation: `${pulse} 2s ease-in-out infinite`,
                            },
                            '&::after': {
                                content: '""',
                                position: 'absolute',
                                bottom: 0,
                                left: '50%',
                                transform: 'translateX(-50%)',
                                width: '20px',
                                height: '20px',
                                borderRadius: '50%',
                                bgcolor: palette.primary.main,
                            },
                        }}
                    />

                    {processSteps.map((step, index) => {
                        const isEven = index % 2 === 0;

                        return (
                            <Box
                                key={index}
                                ref={(el: HTMLDivElement | null) => { stepRefs.current[index] = el; }}
                                sx={{
                                    mb: { xs: 6, md: 8 },
                                    position: 'relative',
                                }}
                            >
                                <Grid container spacing={4} alignItems="center">
                                    {/* Content - Left or Right based on index */}
                                    <Grid
                                        size={{ xs: 12, md: 6 }}
                                        sx={{
                                            order: { xs: 2, md: isEven ? 1 : 2 },
                                        }}
                                    >
                                        <Fade in={visibleSteps[index]} timeout={800}>
                                            <Paper
                                                elevation={0}
                                                sx={{
                                                    p: 4,
                                                    borderRadius: 4,
                                                    background: '#fff',
                                                    border: `2px solid ${step.color}20`,
                                                    position: 'relative',
                                                    overflow: 'hidden',
                                                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                                    transform: visibleSteps[index] ? 'translateX(0)' : `translateX(${isEven ? '-60px' : '60px'})`,
                                                    opacity: visibleSteps[index] ? 1 : 0,
                                                    '&:hover': {
                                                        transform: 'translateY(-8px)',
                                                        boxShadow: `0 12px 40px ${step.color}30`,
                                                        borderColor: step.color,
                                                    },
                                                    '&::before': {
                                                        content: '""',
                                                        position: 'absolute',
                                                        top: 0,
                                                        left: 0,
                                                        right: 0,
                                                        height: '6px',
                                                        background: step.gradient,
                                                    },
                                                }}
                                            >
                                                {/* Step Number Badge */}
                                                <Box
                                                    sx={{
                                                        position: 'absolute',
                                                        top: 20,
                                                        right: 20,
                                                        width: '50px',
                                                        height: '50px',
                                                        borderRadius: '50%',
                                                        background: step.gradient,
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        color: '#fff',
                                                        fontWeight: 700,
                                                        fontSize: '1.5rem',
                                                        boxShadow: `0 4px 12px ${step.color}40`,
                                                    }}
                                                >
                                                    {index + 1}
                                                </Box>

                                                <Typography
                                                    variant="h5"
                                                    component="h3"
                                                    sx={{
                                                        fontWeight: 700,
                                                        mb: 2,
                                                        color: palette.text.primary,
                                                        pr: 7,
                                                        fontSize: { xs: '1.25rem', md: '1.5rem' },
                                                    }}
                                                >
                                                    {step.title}
                                                </Typography>
                                                <Typography
                                                    variant="body1"
                                                    sx={{
                                                        color: palette.text.secondary,
                                                        lineHeight: 1.8,
                                                        fontSize: { xs: '0.95rem', md: '1.05rem' },
                                                    }}
                                                >
                                                    {step.description}
                                                </Typography>
                                            </Paper>
                                        </Fade>
                                    </Grid>

                                    {/* Image - Right or Left based on index */}
                                    <Grid
                                        size={{ xs: 12, md: 6 }}
                                        sx={{
                                            order: { xs: 1, md: isEven ? 2 : 1 },
                                            display: 'flex',
                                            justifyContent: 'center',
                                        }}
                                    >
                                        <Zoom in={visibleSteps[index]} timeout={1000}>
                                            <Box
                                                sx={{
                                                    position: 'relative',
                                                    width: '100%',
                                                    maxWidth: { xs: '100%', md: '450px' },
                                                }}
                                            >
                                                {/* Icon Badge */}
                                                <Box
                                                    sx={{
                                                        position: 'absolute',
                                                        top: -20,
                                                        left: -20,
                                                        width: '80px',
                                                        height: '80px',
                                                        borderRadius: '50%',
                                                        background: step.gradient,
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        color: '#fff',
                                                        boxShadow: `0 8px 24px ${step.color}50`,
                                                        zIndex: 2,
                                                        border: '4px solid #fff',
                                                    }}
                                                >
                                                    {step.icon}
                                                </Box>

                                                {/* Image */}
                                                <Paper
                                                    elevation={0}
                                                    sx={{
                                                        borderRadius: 4,
                                                        overflow: 'hidden',
                                                        border: `3px solid ${step.color}30`,
                                                        transition: 'all 0.4s ease',
                                                        '&:hover': {
                                                            transform: 'scale(1.05)',
                                                            boxShadow: `0 16px 40px ${step.color}40`,
                                                            borderColor: step.color,
                                                        },
                                                    }}
                                                >
                                                    <Box
                                                        component="img"
                                                        src={step.image}
                                                        alt={step.title}
                                                        sx={{
                                                            width: '100%',
                                                            height: { xs: '250px', md: '320px' },
                                                            objectFit: 'cover',
                                                            display: 'block',
                                                        }}
                                                    />
                                                </Paper>
                                            </Box>
                                        </Zoom>
                                    </Grid>
                                </Grid>

                                {/* Timeline Dot for Desktop */}
                                <Box
                                    sx={{
                                        display: { xs: 'none', md: 'block' },
                                        position: 'absolute',
                                        top: '50%',
                                        left: '50%',
                                        transform: 'translate(-50%, -50%)',
                                        width: '30px',
                                        height: '30px',
                                        borderRadius: '50%',
                                        bgcolor: visibleSteps[index] ? step.color : palette.grey[300],
                                        border: '4px solid #fff',
                                        boxShadow: `0 0 0 4px ${visibleSteps[index] ? step.color : palette.grey[300]}30`,
                                        zIndex: 2,
                                        transition: 'all 0.6s ease',
                                    }}
                                />
                            </Box>
                        );
                    })}
                </Container>
            </Box>
        </Box>
    );
};

export default ProductionProcessPage;
