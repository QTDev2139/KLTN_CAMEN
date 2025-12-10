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
import { useTranslation } from 'react-i18next';

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


interface ProcessStep {
    icon: React.ReactNode;
    title: string;
    description: string;
    color: string;
    gradient: string;
    image: string;
}

interface KeyMetric {
    value: string;
    description: string;
    icon: React.ReactNode;
}

const ProductionProcessPage: React.FC = () => {
    const { t } = useTranslation('production-process');
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

    const keyMetrics: KeyMetric[] = [
        {
            value: String(t('key_metrics.0.value', { defaultValue: '100%' })),
            description: String(t('key_metrics.0.description', { defaultValue: 'Quality Assurance' })),
            icon: <VerifiedUser />,
        },
        {
            value: String(t('key_metrics.1.value', { defaultValue: '2 năm' })),
            description: String(t('key_metrics.1.description', { defaultValue: 'Warranty Period' })),
            icon: <AcUnit />,
        },
        {
            value: String(t('key_metrics.2.value', { defaultValue: '0%' })),
            description: String(t('key_metrics.2.description', { defaultValue: 'Defect Rate' })),
            icon: <CheckCircleOutline />,
        },
    ];

    const processSteps: ProcessStep[] = [
        {
            icon: <VerifiedUser sx={{ fontSize: 60 }} />,
            title: t('production_process_steps.0.title', { defaultValue: 'Material Selection & Quality Check' }),
            description: t('production_process_steps.0.description', { defaultValue: 'We carefully select premium materials and conduct thorough quality checks' }),
            color: '#4CAF50',
            gradient: 'linear-gradient(135deg, #4CAF50 0%, #81C784 100%)',
            image: 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=800&auto=format&fit=crop',
        },
        {
            icon: <CheckCircleOutline sx={{ fontSize: 60 }} />,
            title: t('production_process_steps.1.title', { defaultValue: 'Manufacturing Process' }),
            description: t('production_process_steps.1.description', { defaultValue: 'Advanced manufacturing techniques ensure precision and quality' }),
            color: '#2196F3',
            gradient: 'linear-gradient(135deg, #2196F3 0%, #64B5F6 100%)',
            image: 'https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?w=800&auto=format&fit=crop',
        },
        {
            icon: <AcUnit sx={{ fontSize: 60 }} />,
            title: t('production_process_steps.2.title', { defaultValue: 'Testing & Inspection' }),
            description: t('production_process_steps.2.description', { defaultValue: 'Rigorous testing and inspection protocols ensure reliability' }),
            color: '#00BCD4',
            gradient: 'linear-gradient(135deg, #00BCD4 0%, #4DD0E1 100%)',
            image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800&auto=format&fit=crop',
        },
        {
            icon: <Inventory sx={{ fontSize: 60 }} />,
            title: t('production_process_steps.3.title', { defaultValue: 'Packaging & Storage' }),
            description: t('production_process_steps.3.description', { defaultValue: 'Professional packaging and climate-controlled storage' }),
            color: '#FF9800',
            gradient: 'linear-gradient(135deg, #FF9800 0%, #FFB74D 100%)',
            image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&auto=format&fit=crop',
        },
        {
            icon: <LocalShipping sx={{ fontSize: 60 }} />,
            title: t('production_process_steps.4.title', { defaultValue: 'Delivery & Support' }),
            description: t('production_process_steps.4.description', { defaultValue: 'Reliable delivery with comprehensive after-sales support' }),
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
                    minHeight: { xs: '333px', md: '400px' },
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
                                        fontSize: { xs: '0.7rem', md: '0.8rem' },
                                    }}
                                >
                                    {t('procedure')}
                                </Typography>
                            </Box>

                            <Typography
                                variant="h2"
                                component="h1"
                                sx={{
                                    fontWeight: 700,
                                    mb: 2,
                                    fontSize: { xs: '1.5rem', md: '2.5rem' },
                                    color: palette.text.primary,
                                    animation: `${fadeInUp} 1s ease-out 0.2s`,
                                    animationFillMode: 'both',
                                }}
                            >
                                {t('title')}
                            </Typography>

                            <Typography
                                variant="h5"
                                sx={{
                                    mb: 3,
                                    fontSize: { xs: '0.85rem', md: '1rem' },
                                    maxWidth: '900px',
                                    margin: '0 auto 30px',
                                    color: palette.text.secondary,
                                    lineHeight: 1.6,
                                    animation: `${fadeInUp} 1s ease-out 0.4s`,
                                    animationFillMode: 'both',
                                }}
                            >
                                {t('subtitle')}
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
                                {[ // use translated metrics
                                    ...keyMetrics
                                ].map((stat, index) => (
                                    <Grid size={{ xs: 12, sm: 4 }} key={index}>
                                        <Paper
                                            elevation={0}
                                            sx={{
                                                p: 2,
                                                borderRadius: 2,
                                                background: '#fff',
                                                border: `2px solid ${palette.primary.main}20`,
                                                transition: 'all 0.3s ease',
                                                '&:hover': {
                                                    transform: 'translateY(-6px)',
                                                    boxShadow: `0 8px 24px ${palette.primary.main}20`,
                                                    borderColor: palette.primary.main,
                                                },
                                            }}
                                        >
                                            <Box
                                                sx={{
                                                    width: 50,
                                                    height: 50,
                                                    borderRadius: '50%',
                                                    background: `linear-gradient(135deg, ${palette.primary.main} 0%, ${palette.primary.light} 100%)`,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    color: '#fff',
                                                    margin: '0 auto 12px',
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
                                                    mb: 0.5,
                                                    fontSize: { xs: '1.5rem', md: '1.8rem' },
                                                }}
                                            >
                                                {stat.value}
                                            </Typography>
                                            <Typography
                                                variant="body1"
                                                sx={{
                                                    color: palette.text.secondary,
                                                    fontWeight: 600,
                                                    fontSize: { xs: '0.875rem', md: '0.95rem' },
                                                }}
                                            >
                                                {stat.description}
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
