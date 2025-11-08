import { Card, CardContent, CardHeader, CardMedia, Grid } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { blogApi } from '~/apis';
import { Post } from '~/apis/blog/blog.interface.api';
import { SITE_SCREEN } from '~/router/path.route';

const BlogPage: React.FC = () => {
  const [blogResult, setBlogResult] = useState<Post[]>([]);
  const { lang } = useParams();

  useEffect(() => {
    const fetchApi = async () => {
      const result = await blogApi.getListBlog();
      setBlogResult(result.post);
    };
    fetchApi();
  }, []);

  const lists = useMemo(() => {
    return blogResult.filter((p) => p.language?.code === lang);
  }, [blogResult, lang]);

  return (
    <Grid container spacing={4}>
      {lists.map((blog) => {
        return (
          <Grid key={blog.id} size={{ xs: 12, md: 6, lg: 4 }}>
            <Link to={'/' + lang + '/' + SITE_SCREEN.BLOG + '/' + blog.slug}>
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
