import {
  Card,
  CardContent,
  CardMedia,
  Grid,
  Typography,
  Chip,
  Stack,
  CardActionArea,
  Box,
  Container,
  Fade,
  useTheme,
  Button,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { blogApi, postCategoryApi } from '~/apis';
import { Post } from '~/apis/blog/blog.interface.api';
import { PostCategoryTranslationApi } from '~/apis/post-category/post-category.interface.api';
import { getLangPrefix } from '~/common/constant/get-lang-prefix';
import { PADDING_GAP_LAYOUT } from '~/common/constant/style.constant';
import { getLimitLineCss } from '~/common/until/get-limit-line-css';
import ContainerWrapper from '~/components/elements/container/container.element';
import { StackRow } from '~/components/elements/styles/stack.style';
import { useLang } from '~/hooks/use-lang/use-lang';
import { SITE_SCREEN } from '~/router/path.route';
import { Article, Newspaper, Visibility } from '@mui/icons-material';
import { keyframes } from '@mui/system';

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

const BlogPage: React.FC = () => {
  const [blogResult, setBlogResult] = useState<Post[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  const currentLang = useLang();
  const prefix = getLangPrefix(currentLang);
  const { palette } = useTheme();
  const [categoryList, setCategoryList] = useState<PostCategoryTranslationApi[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const filteredBlogs = selectedCategory
    ? blogResult.filter(
        (b) =>
          String(b.post_category?.translations?.[0]?.name ?? '')
            .toLowerCase()
            .trim() === selectedCategory.toLowerCase().trim(),
      )
    : blogResult;

  useEffect(() => {
    setIsVisible(true);
  }, []);

  useEffect(() => {
    const fetchApi = async () => {
      try {
        const result = await blogApi.getListBlog(currentLang === 'en' ? 2 : 1);
        const items = Array.isArray(result) ? result : result?.post ?? result?.posts ?? [];
        setBlogResult(items);
      } catch (err) {
        console.error('Load blogs failed', err);
        setBlogResult([]);
      }
    };
    fetchApi();
  }, [currentLang]);

  useEffect(() => {
    (async () => {
      try {
        const res = await postCategoryApi.getPostCategory(currentLang);
        const items = Array.isArray(res) ? res : (res as any)?.post ?? (res as any)?.posts ?? [];

        const mapped = items.map((it: any) => {
          const translations = it.post_category_translations ?? [];
          // nếu VN -> lấy bản dịch đầu tiên (index 0), nếu EN -> lấy bản dịch thứ 2 (index 1)
          const trIndex = currentLang === 'vi' ? 0 : 1;
          const tr = translations[trIndex] ?? translations[0] ?? {};
          return {
            id: String(it.id ?? it.post_category_id ?? ''),
            name: tr.name ?? '',
          };
        });

        setCategoryList(mapped);
      } catch (err) {
        console.error('Load post categories failed', err);
        setCategoryList([]);
      }
    })();
  }, [currentLang]);

  return (
    <Box component="main" sx={{ bgcolor: palette.background.default }}>
      {/* Hero Banner Section */}
      <Box
        sx={{
          position: 'relative',
          minHeight: { xs: '233px', md: '300px' },
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
            backgroundImage:
              'url("https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=1600&auto=format&fit=crop")',
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
        <Box
          sx={{
            position: 'absolute',
            bottom: '10%',
            left: '5%',
            width: { xs: '120px', md: '200px' },
            height: { xs: '120px', md: '200px' },
            borderRadius: '50%',
            background: `radial-gradient(circle, ${palette.secondary.main}12 0%, transparent 70%)`,
            animation: `${float} 10s ease-in-out infinite`,
            animationDelay: '2s',
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
                <Newspaper sx={{ fontSize: 20, color: palette.primary.main }} />
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
                  Tin tức & Sự kiện
                </Typography>
              </Box>

              <Typography
                variant="h2"
                component="h1"
                sx={{
                  fontWeight: 700,
                  mb: 1.5,
                  fontSize: { xs: '1.5rem', md: '2.5rem' },
                  color: palette.text.primary,
                  animation: `${fadeInUp} 1s ease-out 0.2s`,
                  animationFillMode: 'both',
                }}
              >
                Tin Tức & Bài Viết
              </Typography>

              <Typography
                variant="h5"
                sx={{
                  mb: 2,
                  fontSize: { xs: '0.85rem', md: '1rem' },
                  maxWidth: '800px',
                  margin: '0 auto',
                  color: palette.text.secondary,
                  lineHeight: 1.6,
                  animation: `${fadeInUp} 1s ease-out 0.4s`,
                  animationFillMode: 'both',
                }}
              >
                Cập nhật thông tin mới nhất về sản phẩm, công nghệ và xu hướng trong ngành
              </Typography>

              {/* Preview Button */}
              <Box sx={{ mt: 3, animation: `${fadeInUp} 1s ease-out 0.6s`, animationFillMode: 'both' }}>
                <Button
                  component={Link}
                  to={`${prefix}/${SITE_SCREEN.BLOG}/bai-viet-mau`}
                  variant="contained"
                  startIcon={<Visibility />}
                  sx={{
                    borderRadius: 50,
                    px: 4,
                    py: 1,
                    textTransform: 'none',
                    fontWeight: 600,
                    boxShadow: `0 8px 20px ${palette.primary.main}40`,
                    '&:hover': {
                      boxShadow: `0 12px 24px ${palette.primary.main}60`,
                      transform: 'translateY(-2px)',
                    }
                  }}
                >
                  Xem bài viết mẫu
                </Button>
              </Box>
            </Box>
          </Fade>
        </Container>
      </Box>

      {/* Blog Content Section */}
      <Box sx={{ py: { xs: 6, md: 8 } }}>
        <Container maxWidth="lg">
          <Stack spacing={4}>
            {/* Category Filter */}
            <StackRow sx={{ gap: 1, flexWrap: 'wrap', justifyContent: 'center' }}>
              <Chip
                label="Tất cả"
                onClick={() => setSelectedCategory(null)}
                clickable
                variant={selectedCategory ? 'outlined' : 'filled'}
                color="primary"
                sx={{ 
                  borderRadius: 2, 
                  fontWeight: selectedCategory ? 500 : 700,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: `0 4px 12px ${palette.primary.main}30`,
                  }
                }}
              />
              {categoryList.map((cate) => {
                const isActive =
                  selectedCategory &&
                  String(selectedCategory).toLowerCase().trim() === String(cate.name).toLowerCase().trim();
                return (
                  <Chip
                    key={cate.id}
                    label={cate.name}
                    onClick={() => setSelectedCategory(isActive ? null : cate.name)}
                    clickable
                    variant={isActive ? 'filled' : 'outlined'}
                    color={isActive ? 'primary' : 'default'}
                    sx={{
                      borderRadius: 2,
                      fontWeight: isActive ? 600 : 500,
                      transition: 'all 0.3s ease',
                      '&:hover': { 
                        transform: 'translateY(-2px)',
                        boxShadow: `0 4px 12px ${isActive ? palette.primary.main : palette.grey[400]}30`,
                      },
                    }}
                  />
                );
              })}
            </StackRow>

            {/* Blog Grid */}
            <Grid container spacing={4}>
              {filteredBlogs.map((blog) => {
                const title = blog.translations?.[0]?.title ?? blog.title ?? '';
                const excerpt = blog.translations?.[0]?.meta_description ?? '';
                const date = (blog as any).created_at ?? '';
                const author = (blog as any).user?.name ?? '';

                return (
                  <Grid size={{ xs: 12, md: 6, lg: 4 }} key={blog.id}>
                    <Link to={'' + prefix + '/' + SITE_SCREEN.BLOG + '/' + blog.translations?.[0]?.slug}>
                      <Card 
                        sx={{ 
                          height: '100%', 
                          display: 'flex', 
                          flexDirection: 'column',
                          border: `1px solid ${palette.primary.main}15`,
                          borderRadius: 2,
                          transition: 'all 0.4s ease',
                          '&:hover': {
                            border: `1px solid ${palette.primary.main}`,
                            transform: 'translateY(-8px)',
                            boxShadow: `0 12px 32px ${palette.primary.main}20`,
                          }
                        }}
                      >
                        <CardActionArea sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}>
                          <CardMedia
                            component="div"
                            sx={{
                              pt: '56.25%', // 16:9
                              bgcolor: 'grey.300',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              position: 'relative',
                            }}
                            image={blog.thumbnail ?? ''}
                            title={title}
                          >
                            {!blog.thumbnail && (
                              <Box
                                sx={{
                                  position: 'absolute',
                                  top: '50%',
                                  left: '50%',
                                  transform: 'translate(-50%, -50%)',
                                  textAlign: 'center',
                                }}
                              >
                                <Article sx={{ fontSize: 48, color: palette.text.disabled }} />
                                <Typography variant="subtitle1" color="text.secondary">
                                  No Image
                                </Typography>
                              </Box>
                            )}
                          </CardMedia>
                          <CardContent sx={{ flex: 1 }}>
                            <Typography variant="h6" component="div" sx={{ ...getLimitLineCss(2), mb: 1, fontWeight: 600 }}>
                              {title}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ ...getLimitLineCss(2), mb: 2 }}>
                              {excerpt}
                            </Typography>
                            <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 0.5 }}>
                              <Chip 
                                label={author} 
                                variant="outlined" 
                                size="small"
                                sx={{ 
                                  borderColor: palette.primary.main,
                                  color: palette.primary.main,
                                  fontWeight: 500,
                                }}
                              />
                              <Chip
                                label={new Date(date).toLocaleDateString(currentLang === 'vi' ? 'vi-VN' : 'en-US')}
                                variant="outlined"
                                size="small"
                              />
                            </Stack>
                          </CardContent>
                        </CardActionArea>
                      </Card>
                    </Link>
                  </Grid>
                );
              })}
            </Grid>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
};
export default BlogPage;
