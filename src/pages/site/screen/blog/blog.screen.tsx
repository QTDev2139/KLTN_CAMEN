import { Card, CardContent, CardHeader, CardMedia, Grid } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { blogApi } from '~/apis';
import { Post } from '~/apis/blog/blog.interface.api';
import { getLangPrefix } from '~/common/constant/get-lang-prefix';
import { useLang } from '~/hooks/use-lang/use-lang';
import { SITE_SCREEN } from '~/router/path.route';

const BlogPage: React.FC = () => {
  const [blogResult, setBlogResult] = useState<Post[]>([]);
  const currentLang = useLang();
  const prefix = getLangPrefix(currentLang);

  useEffect(() => {
    const fetchApi = async () => {
      const result = await blogApi.getListBlog();
      setBlogResult(result.post);
    };
    fetchApi();
  }, []);

  const lists = useMemo(() => {
    return blogResult.filter((p) => p.language?.code === currentLang);
  }, [blogResult, currentLang]);

  return (
    <Grid container spacing={4}>
      {lists.map((blog) => {
        return (
          <Grid key={blog.id} size={{ xs: 12, md: 6, lg: 4 }}>
            <Link to={'/' + prefix + SITE_SCREEN.BLOG + '/' + blog.slug}>
              <Card sx={{ maxWidth: 345, maxHeight: 500 }}>
                <CardMedia component="img" height="220" image={blog.thumbnail} alt="Blog" />
                <CardHeader title={blog.meta_title} />
                <CardContent>{blog.meta_description}</CardContent>
              </Card>
            </Link>
          </Grid>
        );
      })}
    </Grid>
  );
};
export default BlogPage;
