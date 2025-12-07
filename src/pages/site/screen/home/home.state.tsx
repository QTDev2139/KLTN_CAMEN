import { keyframes } from '@mui/system';
import { TFunction } from 'i18next';

// Keyframe animations
export const fadeInUp = keyframes`
    from {
        opacity: 0;
        transform: translateY(30px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
`;

export const slideInLeft = keyframes`
    from {
        opacity: 0;
        transform: translateX(-50px);
    }
    to {
        opacity: 1;
        transform: translateX(0);
    }
`;

export const slideInRight = keyframes`
    from {
        opacity: 0;
        transform: translateX(50px);
    }
    to {
        opacity: 1;
        transform: translateX(0);
    }
`;

export const scrollAnimation = keyframes`
    0% {
        transform: translateX(0);
    }
    100% {
        transform: translateX(-50%);
    }
`;

// Timeline data
export interface TimelineItem {
    year: string;
    title: string;
    description: string;
    images: string[];
}

export const getTimelineData = (t: TFunction<'home'>): TimelineItem[] => [
    {
        year: '2025',
        title: t('milestone_2025_title'),
        description: t('milestone_2025_description'),
        images: [
            'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=800&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1526367790999-0150786686a2?q=80&w=800&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=800&auto=format&fit=crop',
        ],
    },
    {
        year: '2024',
        title: t('milestone_2024_title'),
        description: t('milestone_2024_description'),
        images: [
            'https://images.unsplash.com/photo-1559827260-dc66d52bef19?q=80&w=800&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1556912173-3bb406ef7e77?q=80&w=800&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=800&auto=format&fit=crop',
        ],
    },
    {
        year: '2023',
        title: t('milestone_2023_title'),
        description: t('milestone_2023_description'),
        images: [
            'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=800&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1511920170033-f8396924c348?q=80&w=800&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1521017432531-fbd92d768814?q=80&w=800&auto=format&fit=crop',
        ],
    },
    {
        year: '2022',
        title: t('milestone_2022_title'),
        description: t('milestone_2022_description'),
        images: [
            'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=800&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=800&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1498837167922-ddd27525d352?q=80&w=800&auto=format&fit=crop',
        ],
    },
];
