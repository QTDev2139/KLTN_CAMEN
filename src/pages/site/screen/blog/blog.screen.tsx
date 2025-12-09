import {
  Card,
  CardContent,
  CardMedia,
  Grid,
  Typography,
  Chip,
  Stack,
  CardActionArea,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
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

const BlogPage: React.FC = () => {
  const { t } = useTranslation('category');
  const [blogResult, setBlogResult] = useState<Post[]>([]);
  const currentLang = useLang();
  const prefix = getLangPrefix(currentLang);
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
    <ContainerWrapper sx={{ padding: PADDING_GAP_LAYOUT }}>
      <Stack>
        <StackRow sx={{ gap: 1, flexWrap: 'wrap', mb: 2 }}>
          <Chip
            label={t('all')}
            onClick={() => setSelectedCategory(null)}
            clickable
            variant={selectedCategory ? 'outlined' : 'filled'}
            color="primary"
            sx={{ borderRadius: 2, fontWeight: selectedCategory ? 500 : 700 }}
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
                  '&:hover': { boxShadow: 1 },
                }}
              />
            );
          })}
        </StackRow>
        <Grid container spacing={4}>
          {filteredBlogs.map((blog) => {
            const title = blog.translations?.[0]?.title ?? blog.title ?? '';
            const excerpt = blog.translations?.[0]?.meta_description ?? '';
            const date = (blog as any).created_at ?? '';
            const author = (blog as any).user?.name ?? '';

            return (
              <Grid size={{ xs: 12, md: 6, lg: 4 }} key={blog.id}>
                <Link to={'' + prefix + '/' + SITE_SCREEN.BLOG + '/' + blog.translations?.[0]?.slug}>
                  <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <CardActionArea sx={{ flex: 1 }}>
                      <CardMedia
                        component="div"
                        sx={{
                          pt: '56.25%' // 16:9
                          , bgcolor: 'grey.300',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                        image={blog.thumbnail ?? ''}
                        title={title}
                      >
                        {!blog.thumbnail && (
                          <Typography variant="subtitle1" color="text.secondary">
                            No Image
                          </Typography>
                        )}
                      </CardMedia>
                      <CardContent sx={{ flex: 1 }}>
                        <Typography variant="h6" component="div" noWrap sx={getLimitLineCss(2)}>
                          {title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }} noWrap>
                          {excerpt}
                        </Typography>
                        <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }}>
                          <Chip label={author} variant="outlined" size="small" />
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
    </ContainerWrapper>
  );
};
export default BlogPage;
