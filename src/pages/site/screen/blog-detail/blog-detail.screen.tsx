import { Stack, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { blogApi } from '~/apis';
import { Post } from '~/apis/blog/blog.interface.api';
import { getLangPrefix } from '~/common/constant/get-lang-prefix';
import { PADDING_GAP_LAYOUT } from '~/common/constant/style.constant';
import ContainerWrapper from '~/components/elements/container/container.element';
import { useLang } from '~/hooks/use-lang/use-lang';

const BlogDetailPage: React.FC = () => {
  const { slug } = useParams();
  const currentLang = useLang();
  const prefix = getLangPrefix(currentLang); // assume '' or 'en'
  const [blogDetail, setBlogDetail] = useState<Post | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const lang = currentLang === 'vi' ? 1 : 2;
    const fetchApi = async () => {
      if (!slug) return;
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

  return (
    <ContainerWrapper sx={{ padding: PADDING_GAP_LAYOUT }}>
      <Stack>
        <Typography variant="subtitle2">
          {/* Sanitize content to avoid blocked script errors; strip scripts server-side or use DOMPurify */}
          <div dangerouslySetInnerHTML={{ __html: blogDetail?.translations?.[0]?.content ?? '' }} />
        </Typography>
      </Stack>
    </ContainerWrapper>
  );
};
export default BlogDetailPage;
