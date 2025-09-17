import { Stack, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { blogApi } from '~/apis';
import { Post } from '~/apis/blog/blog.api.interface';

export default function BlogDetailScreen() {
  const [key_t, setKey_t] = useState<string | null>();
  const { lang, slug } = useParams();
  const [blogDetail, setBlogDetail] = useState<Post | null>();
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      const resultKey = await blogApi.getKey(slug || '');
      setKey_t(resultKey);
    })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if ((lang === 'vi' || lang === 'en') && key_t) {
      const fetchApi = async () => {
        try {
          const result = await blogApi.getBlogByLangAndKey(lang, key_t);
          setBlogDetail(result);
          // navigate('');
          if (result.slug && result.slug !== slug) {
            navigate(`/${lang}/blog/${result.slug}`, { replace: true });
          }
        } catch (error) {
          console.error('Error loading blog:', error);
        }
      };
      fetchApi();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang, key_t]);

  return (
    <Stack>
      <Typography>{blogDetail?.title}</Typography>
      <Typography>{blogDetail?.content}</Typography>
    </Stack>
  );
}
