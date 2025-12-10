import { 
  Stack, 
  Typography, 
  Box, 
  Container, 
  Chip, 
  Avatar, 
  Divider, 
  Button, 
  useTheme, 
  Paper,
  Breadcrumbs,
  Fade
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate, useParams, useLocation, Link as RouterLink } from 'react-router-dom';
import { blogApi } from '~/apis';
import { Post } from '~/apis/blog/blog.interface.api';
import { getLangPrefix } from '~/common/constant/get-lang-prefix';
import { useLang } from '~/hooks/use-lang/use-lang';
import { AccessTime, Person, ArrowBack, NavigateNext, CalendarToday } from '@mui/icons-material';
import { keyframes } from '@mui/system';
import { SITE_SCREEN } from '~/router/path.route';

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

const BlogDetailPage: React.FC = () => {
  const { slug } = useParams();
  const currentLang = useLang();
  const prefix = getLangPrefix(currentLang);
  const [blogDetail, setBlogDetail] = useState<Post | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { palette } = useTheme();

  // Mock Data for Preview
  const MOCK_POST: Post = {
    id: 999,
    title: 'Khám phá quy trình sản xuất hiện đại tại nhà máy',
    status: 1,
    created_at: new Date().toISOString(),
    thumbnail: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1600&auto=format&fit=crop',
    user: { id: 1, name: 'Admin' },
    post_category: {
      id: 1,
      translations: [{ name: 'Công nghệ & Sản xuất' }]
    },
    translations: [
      {
        id: 1,
        language_id: 1,
        title: 'Khám phá quy trình sản xuất hiện đại tại nhà máy',
        slug: 'bai-viet-mau',
        content: `
          <p>Trong kỷ nguyên công nghiệp 4.0, việc áp dụng công nghệ vào quy trình sản xuất không chỉ là xu hướng mà còn là yếu tố sống còn của doanh nghiệp. Tại nhà máy của chúng tôi, mỗi sản phẩm được tạo ra là kết tinh của công nghệ hiện đại và tâm huyết của đội ngũ kỹ sư lành nghề.</p>
          
          <h2>1. Tự động hóa dây chuyền sản xuất</h2>
          <p>Chúng tôi đã đầu tư hệ thống robot tự động hóa hoàn toàn cho các công đoạn lắp ráp chính xác. Điều này giúp giảm thiểu sai sót của con người xuống mức gần như bằng 0, đồng thời tăng năng suất lên gấp 3 lần so với phương pháp truyền thống.</p>
          
          <blockquote>
            "Chất lượng không phải là một hành động, nó là một thói quen. Chúng tôi cam kết mang đến những sản phẩm tốt nhất cho khách hàng thông qua việc không ngừng cải tiến quy trình."
          </blockquote>

          <h2>2. Kiểm soát chất lượng nghiêm ngặt</h2>
          <p>Mỗi sản phẩm trước khi xuất xưởng đều phải trải qua quy trình kiểm tra chất lượng (QC) gồm 5 bước nghiêm ngặt:</p>
          <ul>
            <li>Kiểm tra nguyên liệu đầu vào</li>
            <li>Kiểm tra bán thành phẩm</li>
            <li>Kiểm tra lắp ráp</li>
            <li>Kiểm tra vận hành thử nghiệm</li>
            <li>Kiểm tra đóng gói cuối cùng</li>
          </ul>

          <p>Hệ thống cảm biến IoT được lắp đặt tại mọi điểm quan trọng trên dây chuyền giúp chúng tôi giám sát các thông số kỹ thuật theo thời gian thực (Real-time monitoring). Bất kỳ sự sai lệch nào dù là nhỏ nhất cũng được phát hiện và xử lý ngay lập tức.</p>

          <h3>Cam kết về môi trường</h3>
          <p>Bên cạnh chất lượng, chúng tôi cũng đặc biệt chú trọng đến vấn đề bảo vệ môi trường. Hệ thống xử lý nước thải và khí thải đạt chuẩn quốc tế ISO 14001 đảm bảo hoạt động sản xuất của chúng tôi thân thiện với môi trường xung quanh.</p>
          
          <img src="https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=1200&auto=format&fit=crop" alt="Dây chuyền sản xuất" />
          
          <p>Chúng tôi tin rằng, với sự đầu tư bài bản và định hướng phát triển bền vững, các sản phẩm của chúng tôi sẽ tiếp tục chinh phục được niềm tin của khách hàng trong và ngoài nước.</p>
        `,
        meta_title: 'Mock Post',
        meta_description: 'This is a mock post for preview purposes'
      }
    ]
  };

  useEffect(() => {
    setIsVisible(true);
  }, []);

  useEffect(() => {
    const lang = currentLang === 'vi' ? 1 : 2;
    const fetchApi = async () => {
      if (!slug) return;

      // Check for mock slug
      if (slug === 'bai-viet-mau') {
        setBlogDetail(MOCK_POST);
        return;
      }

      try {
        const result = await blogApi.getDetailBlog(lang, slug);
        setBlogDetail(result);

        const tr =
          (result.translations || []).find((t: any) => Number(t.language_id) === Number(lang)) ||
          (result.translations || [])[0];

        if (tr?.slug) {
          const langSegment = prefix ? `/${prefix}` : '';
          const newPath = `${langSegment}/blog/${tr.slug}`.replace(/\/+/g, '/');

          const normalize = (p: string) => p.replace(/\/+$/, '');
          if (normalize(location.pathname) !== normalize(newPath)) {
            navigate(newPath, { replace: true });
          }
        }
      } catch (error) {
        console.error('Error loading blog:', error);
      }
    };
    fetchApi();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentLang, slug]);

  if (!blogDetail) return null;

  const translation = blogDetail.translations?.[0];
  const title = translation?.title || blogDetail.title;
  const content = translation?.content || '';
  const categoryName = blogDetail.post_category?.translations?.[0]?.name || 'General';
  const authorName = blogDetail.user?.name || 'Admin';
  const publishDate = new Date(blogDetail.created_at).toLocaleDateString(currentLang === 'vi' ? 'vi-VN' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <Box component="main" sx={{ bgcolor: palette.background.default, minHeight: '100vh', pb: 8 }}>
      {/* Hero Header with Background Image */}
      <Box
        sx={{
          position: 'relative',
          height: { xs: '150px', md: '200px' },
          width: '100%',
          overflow: 'hidden',
          bgcolor: 'rgb(32, 31, 63)',
        }}
      >
        <Container maxWidth="lg" sx={{ position: 'relative', height: '100%', display: 'flex', alignItems: 'flex-end', pb: 4 }}>
          <Fade in={isVisible} timeout={1000}>
            <Stack spacing={1} sx={{ width: '100%', maxWidth: '900px', mx: 'auto', color: '#fff' }}>
              {/* Breadcrumbs */}
              <Breadcrumbs 
                separator={<NavigateNext fontSize="small" sx={{ color: 'rgba(255,255,255,0.7)' }} />} 
                aria-label="breadcrumb"
                sx={{ mb: 1, '& .MuiBreadcrumbs-li': { color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem' } }}
              >
                <RouterLink to={`${prefix}/`} style={{ color: 'inherit', textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
                  Home
                </RouterLink>
                <RouterLink to={`${prefix}/${SITE_SCREEN.BLOG}`} style={{ color: 'inherit', textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
                  Blog
                </RouterLink>
                <Typography color="#fff" sx={{ fontWeight: 500, fontSize: '0.85rem' }}>{title}</Typography>
              </Breadcrumbs>

              <Chip 
                label={categoryName} 
                size="small"
                sx={{ 
                  bgcolor: palette.primary.main, 
                  color: '#fff', 
                  fontWeight: 600, 
                  width: 'fit-content',
                  height: '24px',
                  fontSize: '0.75rem'
                }} 
              />
              
              <Typography 
                variant="h1" 
                sx={{ 
                  fontSize: { xs: '1.2rem', md: '1.8rem' }, 
                  fontWeight: 800,
                  lineHeight: 1.2,
                  textShadow: '0 2px 10px rgba(0,0,0,0.3)'
                }}
              >
                {title}
              </Typography>

              <Stack direction="row" spacing={3} alignItems="center" sx={{ flexWrap: 'wrap', gap: 2 }}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Avatar sx={{ width: 24, height: 24, bgcolor: palette.primary.main, fontSize: '0.8rem' }}>
                    {authorName.charAt(0)}
                  </Avatar>
                  <Typography variant="subtitle2" fontWeight={500}>{authorName}</Typography>
                </Stack>
                <Stack direction="row" spacing={1} alignItems="center">
                  <CalendarToday sx={{ fontSize: 16, opacity: 0.8 }} />
                  <Typography variant="subtitle2">{publishDate}</Typography>
                </Stack>
              </Stack>
            </Stack>
          </Fade>
        </Container>
      </Box>

      {/* Main Content Area */}
      <Container maxWidth="md" sx={{ mt: 4, position: 'relative', zIndex: 2 }}>
        <Fade in={isVisible} timeout={1500}>
          <Paper 
            elevation={0} 
            sx={{ 
              p: { xs: 3, md: 6 }, 
              borderRadius: 4,
              boxShadow: '0 10px 40px -10px rgba(0,0,0,0.1)',
              animation: `${fadeInUp} 1s ease-out 0.2s`,
              animationFillMode: 'both',
            }}
          >
            {/* Content Body */}
            <Box 
              className="blog-content"
              sx={{
                '& img': {
                  maxWidth: '100%',
                  height: 'auto',
                  borderRadius: 2,
                  my: 3,
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                },
                '& h2': {
                  fontSize: '1.8rem',
                  fontWeight: 700,
                  mt: 4,
                  mb: 2,
                  color: palette.text.primary,
                },
                '& h3': {
                  fontSize: '1.5rem',
                  fontWeight: 600,
                  mt: 3,
                  mb: 2,
                  color: palette.text.primary,
                },
                '& p': {
                  fontSize: '1.1rem',
                  lineHeight: 1.8,
                  mb: 2,
                  color: palette.text.secondary,
                },
                '& ul, & ol': {
                  mb: 3,
                  pl: 4,
                  '& li': {
                    fontSize: '1.1rem',
                    lineHeight: 1.8,
                    mb: 1,
                    color: palette.text.secondary,
                  }
                },
                '& blockquote': {
                  borderLeft: `4px solid ${palette.primary.main}`,
                  m: 0,
                  my: 4,
                  pl: 3,
                  py: 1,
                  bgcolor: `${palette.primary.main}08`,
                  borderRadius: '0 8px 8px 0',
                  '& p': {
                    fontStyle: 'italic',
                    fontWeight: 500,
                    color: palette.text.primary,
                    mb: 0,
                  }
                },
                '& a': {
                  color: palette.primary.main,
                  textDecoration: 'none',
                  '&:hover': {
                    textDecoration: 'underline',
                  }
                }
              }}
            >
              <div dangerouslySetInnerHTML={{ __html: content }} />
            </Box>

            <Divider sx={{ my: 4 }} />

            {/* Footer Actions */}
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Button 
                component={RouterLink} 
                to={`${prefix}/${SITE_SCREEN.BLOG}`}
                startIcon={<ArrowBack />}
                sx={{ fontWeight: 600 }}
              >
                Back to Blog
              </Button>
            </Box>
          </Paper>
        </Fade>
      </Container>
    </Box>
  );
};
export default BlogDetailPage;

