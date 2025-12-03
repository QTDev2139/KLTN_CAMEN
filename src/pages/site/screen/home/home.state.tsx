import { keyframes } from '@mui/system';
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

export const timelineData: TimelineItem[] = [
    {
        year: '2025',
        title: 'Đa dạng hoá sản phẩm & Top 10 The Future Brand',
        description: 'Ra mắt bún cá rô, bún cá ngừ, hủ tiếu mực, bún chay, mì quảng tôm, mì quảng cá lóc. Vinh dự lọt Top 10 The Future Brand, khẳng định tầm nhìn phát triển bền vững.',
        images: [
            'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=800&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1526367790999-0150786686a2?q=80&w=800&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=800&auto=format&fit=crop',
        ],
    },
    {
        year: '2024',
        title: 'Bứt phá với Sharktank & Top 10 Startup Wheel',
        description: 'Ra mắt bánh canh cua, bún bò Huế, bánh canh chả cá. Ghi dấu ấn tại Sharktank Việt Nam và lọt Top 10 Startup Wheel, khẳng định vị thế doanh nghiệp khởi nghiệp sáng tạo.',
        images: [
            'https://images.unsplash.com/photo-1559827260-dc66d52bef19?q=80&w=800&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1556912173-3bb406ef7e77?q=80&w=800&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=800&auto=format&fit=crop',
        ],
    },
    {
        year: '2023',
        title: 'Mở rộng dòng sản phẩm & Xuất khẩu chính ngạch',
        description: 'Ra mắt miến lươn, bún lươn xào nghệ. Đưa vào vận hành nhà máy sản xuất hiện đại và chính thức xuất khẩu chính ngạch, mở ra thị trường quốc tế.',
        images: [
            'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=800&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1511920170033-f8396924c348?q=80&w=800&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1521017432531-fbd92d768814?q=80&w=800&auto=format&fit=crop',
        ],
    },
    {
        year: '2022',
        title: 'Ra mắt Cháo bột (Bánh canh) Cá lóc',
        description: 'Đánh dấu bước đầu tiên trong việc đưa đặc sản Việt vào dạng đóng gói tiện lợi với sản phẩm cháo bột cá lóc - món ăn truyền thống được yêu thích.',
        images: [
            'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=800&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=800&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1498837167922-ddd27525d352?q=80&w=800&auto=format&fit=crop',
        ],
    },
];
